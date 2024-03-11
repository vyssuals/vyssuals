import { liveQuery, type Observable } from 'dexie';
import { DataSourceDatabase } from './dataSourceDatabase';
import { VyssualsDatabase } from './vyssualsDatabase';  

class DatabaseManager {
    private databases: Map<string, DataSourceDatabase>;
    public vyssuals: VyssualsDatabase;

    constructor() {
        this.databases = new Map();
        this.vyssuals = new VyssualsDatabase();
    }

    get(name: string, type: string = 'websocket'): DataSourceDatabase {
        let database = this.databases.get(name);
        if (!database) {
            database = new DataSourceDatabase(name);
            database.setType(type);
            this.databases.set(name, database);
        }
        return database;
    }

    get hasDatabases(): Observable<boolean> {
        return liveQuery(() => this.databases.size > 0);
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

    get dataSourceNames(): Observable<string[]> {
        return liveQuery(() => Array.from(this.databases.keys()));
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