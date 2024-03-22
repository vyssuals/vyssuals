import { liveQuery, type Observable } from 'dexie';
import { DataSourceDatabase } from './dataSourceDatabase';
import { VyssualsDatabase } from './vyssualsDatabase';  
import Dexie from 'dexie';
import { writable, type Writable } from 'svelte/store';

class DatabaseManager {
    public databases: Map<string, DataSourceDatabase>;
    public vyssuals: VyssualsDatabase;
    public hasDatabases = writable(false);

    constructor() {
        this.databases = new Map();
        this.vyssuals = new VyssualsDatabase();
        Dexie.getDatabaseNames().then(names => {
            for (let name of names) {
                if (name === 'vyssuals') continue;
                const db = this.get(name);
                this.hasEmptyTables(db).then((empty) => {
                    if (empty) {
                        this.deleteDatabase(name);
                    }
                });
            }
        });
    }

    get(name: string, type: string = ""): DataSourceDatabase {
        if (name === 'vyssuals') {
            throw new Error('The name "vyssuals" is reserved and cannot be used for a DataSourceDatabase.');
        }

        let database = this.databases.get(name);
        if (!database) {
            database = new DataSourceDatabase(name);
            if (type) { database.setType(type) };
            this.databases.set(name, database);
            this.hasDatabases.set(true);
        }
        return database;
    }

    get dataSourceNames(): string[] {
        return Array.from(this.databases.keys());
    }

    get wsNames(): Observable<string[]> {
        return liveQuery(async () => {
            let names: string[] = [];
            for (let x of this.databases.values()) {
                if ((await x.type) === 'websocket') {
                    names.push(x.name);
                }
            }
            return names;
        });
    }

    get fileNames(): Observable<string[]> {
        return liveQuery(async () => {
            let names: string[] = [];
            for (let x of this.databases.values()) {
                if ((await x.type) === 'file') {
                    names.push(x.name);
                }
            }
            return names;
        });
    }

    deleteDatabase(name: string) {
        const dbInstance = this.databases.get(name);
        if (dbInstance) {
            dbInstance.delete();
        }
        this.databases.delete(name);
        this.cleanChartConfigs(name);
        if (this.databases.size === 0) {
            this.hasDatabases.set(false);
        }
    }

    private cleanChartConfigs(name: string) {
        this.vyssuals.chartConfigs.where('dataSourceName').equals(name).delete();
    }

    private async hasEmptyTables(db: DataSourceDatabase): Promise<boolean> {
        for (let table of db.tables) {
            if (await table.count() > 0) return false;
        }
        return true;
    }
}

export const db = new DatabaseManager();