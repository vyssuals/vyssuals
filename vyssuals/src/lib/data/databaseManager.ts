import { liveQuery, type Observable } from 'dexie';
import { DataSourceDatabase } from './dataSourceDatabase';
import { VyssualsDatabase } from './vyssualsDatabase';  
import Dexie from 'dexie';
import { writable, type Writable } from 'svelte/store';

class DatabaseManager {
    public databases: Map<string, DataSourceDatabase>;
    public vyssuals: VyssualsDatabase;
    public hasDatabases = writable(false);
    public dataSourceNames: Writable<string[]> = writable([]);

    constructor() {
        this.databases = new Map();
        this.vyssuals = new VyssualsDatabase();
        Dexie.getDatabaseNames().then(names => {
            for (let name of names) {
                if (name === 'vyssuals') continue;
                this.get(name);
            }
        });
    }

    get(name: string, type: string = 'websocket'): DataSourceDatabase {
        if (name === 'vyssuals') {
            throw new Error('The name "vyssuals" is reserved and cannot be used for a DataSourceDatabase.');
        }

        let database = this.databases.get(name);
        if (!database) {
            database = new DataSourceDatabase(name);
            database.setType(type);
            this.databases.set(name, database);
            this.hasDatabases.set(true);
            this.dataSourceNames.update(names => {
                return [...names, name];
            });
        }
        return database;
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
    }
}

export const db = new DatabaseManager();