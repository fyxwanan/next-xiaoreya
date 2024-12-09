import DBEntry, { DBEntryOptionsType } from "./DBEntry";

class IndexedDBStore {
    private static indexedDBStore: IndexedDBStore;
    public dbMap: Map<string, DBEntry> = new Map();


    public static get instance() {
        if (!IndexedDBStore.indexedDBStore) {
            IndexedDBStore.indexedDBStore = new IndexedDBStore();
        }
        return IndexedDBStore.indexedDBStore;
    }

    public async getDB(name: string, options?: DBEntryOptionsType | DBEntryOptionsType[]): Promise<DBEntry> {
        // const promiseDB = new Promise(async (resolve: (db: DBEntry) => void, reject) => {
        //     if (!this.dbMap.get(name)) {
        //         const db = new DBEntry();
        //         this.setDB(name, db);
        //         await db.openIndexedDB(name, options);
        //         resolve(db);
        //     }
        //     const db = this.dbMap.get(name) as DBEntry;
        //     await db.openIndexedDB(name, options);
        //     resolve(db);
        // });
        // promiseDB.then((db) => {
        //     return db;
        // });

        if (this.dbMap.has(name)) {
            const db = this.dbMap.get(name) as DBEntry;
            return db
        }
        const db = new DBEntry();
        await db.openIndexedDB(name, options);
        this.setDB(name, db);
        return db;
    }

    public setDB(name: string, db: DBEntry) {
        this.dbMap.set(name, db);
    }

}

export default IndexedDBStore;