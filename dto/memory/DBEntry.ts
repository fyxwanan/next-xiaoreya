"use client"

export type DBEntryOptionsType = {
    keyPath?: string;
    autoIncrement?: boolean;
    indexColumns?: StoresType[];
    storeName?: string;
}

export type StoresType = {
    indexKey: string;
    unique: boolean;
}

class DBEntry {
    private static dbEntry: DBEntry;
    private db: IDBDatabase | null = null;
    public request: IDBOpenDBRequest | null = null;
    private hasInitialized: boolean = false;

    public static get instance(): DBEntry {
        if (!DBEntry.dbEntry) {
            DBEntry.dbEntry = new DBEntry()
        }
        return DBEntry.dbEntry;
    }

    public setCurrentDB = (db: IDBDatabase) => {
        this.db = db;
    }

    public getCurrentDB = () => {
        return this.db;
    }

    public setInitialize(initialize: boolean) {
        this.hasInitialized = initialize;
    }

    public getInitialize() {
        return this.hasInitialized;
    }

    openIndexedDB = async (name: string, options?: DBEntryOptionsType | DBEntryOptionsType[]) => {
        if (typeof window === 'undefined') {
            console.warn("IndexedDB is not available in server-side rendering environment.");
            return;
        }

        const request = window.indexedDB.open(name);
        request.onupgradeneeded = (event) => {
            const target = event.target as IDBOpenDBRequest;
            const db = target.result as IDBDatabase;

            if (Array.isArray(options)) {
                options.map((option) => {
                    this.createObjectStore(db, option)
                })
            } else {
                const option = options as DBEntryOptionsType;
                this.createObjectStore(db, option)
            }
        }

        return new Promise((resolve, reject) => {

            request.onerror = (event) => {
                const target = event.target as IDBRequest;
                console.error("Database error:", target.error);
            };

            request.onsuccess = (event) => {
                const target = event.target as IDBOpenDBRequest;
                if (target && target.result) {
                    this.setCurrentDB(target.result);
                    this.setInitialize(true);
                    resolve(true);
                }
            }

            this.request = request;
        })
    }

    createObjectStore(db: IDBDatabase, option: DBEntryOptionsType) {
        if (option?.storeName) {
            let store;
            if (!option?.keyPath) {
                store = db.createObjectStore(option?.storeName, { autoIncrement: true });
            } else {
                store = db.createObjectStore(option?.storeName, { keyPath: option?.keyPath, autoIncrement: option?.autoIncrement });
            }
            if (option?.indexColumns) {
                option?.indexColumns.forEach(index => {
                    store.createIndex(index.indexKey, index.indexKey, { unique: index.unique });
                });
            }
        }
    }

    async insertOne(storeName: string, data: any) {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            const store = this.db!.transaction(storeName, "readwrite").objectStore(storeName);
            const request = store.add(data);
            request.onsuccess = (event) => {
                const target = event.target as IDBRequest;
                console.log("数据插入成功", target.result);
                resolve(target.result);
            }
            request.onerror = (event) => {
                const target = event.target as IDBRequest;
                console.error("数据插入失败", target.error);
                reject(target.error);
            }
        })
    }

    insertMany(storeName: string, data: any[]) {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        const store = this.db.transaction(storeName, "readwrite").objectStore(storeName);
        data.forEach((i) => {
            const request = store.add(i);
            request.onsuccess = (event) => {
                const target = event.target as IDBRequest;
                console.log("数据插入成功", target.result);
            }
            request.onerror = (event) => {
                const target = event.target as IDBRequest;
                console.error("数据插入失败", target.error);
            }
        })

    }

    deleteOne(storeName: string, id: string | number): Promise<string | number> {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        const store = this.db.transaction([storeName], "readwrite").objectStore(storeName);
        // store.delete(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id)
            request.onsuccess = function (e) {
                resolve(id)
            }
            request.onerror = function () {
                reject({
                    status: false,
                    message: "删除失败",
                })
            }
        })
    }

    updateDB(storeName: string, data?: any): Promise<any> {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            const store = this.db!.transaction(storeName, "readwrite").objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = (event) => {
                const target = event.target as IDBRequest;
                console.log("数据更新成功", target.result);
                resolve(target.result);
            }
            request.onerror = (event) => {
                const target = event.target as IDBRequest;
                console.error("数据更新失败", target.error);
                reject({
                    status: false,
                    message: target.error?.message || "数据更新失败"
                })
            }
        })
    }

    async search(storeName: string, keyword?: string): Promise<any[]> {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            const store = this.db!.transaction(storeName, "readonly").objectStore(storeName);
            store.getAll().onsuccess = (event) => {
                const target = event.target as IDBRequest;
                console.log("查询结果", target.result);
                resolve(target.result)
            }
        })
    }



    // 通过主键查询数据（数据库对象，表名，主键值）
    getDataByKey = (storeName: string, key: string) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([storeName]) // 事务
            const objectStore = transaction.objectStore(storeName) // 仓库对象
            const request = objectStore.get(key) // 通过主键获取的查询数据
            //失败回调函数
            request.onerror = function (event) {
                console.log('事务失败')
            }
            //查询成功回调函数
            request.onsuccess = function (event) {
                // console.log('主键查询结果: ', request.result)
                //返回值对应的值
                resolve(request.result)
            }
        })
    }

    // 通过游标查询所有数据（数据库对象，表名）
    cursorGetData = (storeName: string) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        let list: any[] = []
        const store = this.db!
            .transaction(storeName, 'readwrite') // 事务
            .objectStore(storeName) // 仓库对象
        //初始化了一个游标对象（指针对象）
        const request = store.openCursor()
        //成功回调函数， 游标开启成功，逐行读数据
        return new Promise((resolve, reject) => {
            request.onsuccess = function (event) {
                const target = event.target as IDBRequest;
                let cursor = target.result
                if (cursor) {
                    // 将查询值添加到列表中（游标.value=获取值）
                    list.push(cursor.value)
                    cursor.continue() // 遍历了存储对象中的所有内容
                } else {
                    // console.log('游标读取的数据：', list)
                    resolve(list)
                }
            }
            request.onerror = function (e) {
                reject(e)
            }
        })
    }
    // 分页查询
    cursorGetDataByPage = (storeName: string, page: number, pageSize: number) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        let list: any[] = []
        const store = this.db!
            .transaction(storeName, 'readwrite') // 事务
            .objectStore(storeName) // 仓库对象
        //初始化了一个游标对象（指针对象）
        const request = store.openCursor()
        let count = store.count()
        //成功回调函数， 游标开启成功，逐行读数据
        return new Promise((resolve, reject) => {
            let index = 0;
            request.onsuccess = function (event) {
                let res = (event.target as IDBRequest).result
                if (res) {
                    if (index === pageSize - 1) {
                        list.push(res.value)
                        // console.log('读取数据成功1：', list)
                        // console.log('总条目', count.result)
                        resolve({ code: 200, list, count: count.result })
                        return
                    }
                    if (index === null && page !== 1) {
                        // console.log('读取跳过：', (page - 1) * pageSize)
                        index = 0
                        res.advance((page - 1) * pageSize)
                    } else {
                        index++
                        // console.log(res.value)
                        list.push(res.value)
                        res.continue()
                    }
                } else {
                    // console.log('读取数据成功2：', list)
                    // console.log('总条目', count.result)
                    resolve({ code: 200, list, count: list.length == 0 ? list.length : count.result })
                }
            }
            request.onerror = function (e) {
                reject(e)
            }
        })
    }

    // 通过索引查询,查询满足相等条件的第一条数据（数据库对象，表名，索引名字，索引值）
    getDataByIndex = (storeName: string, indexName: string, indexValue: string) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        //通过Promise实现异步回调
        return new Promise((resolve, reject) => {
            const store = this.db!.transaction(storeName, 'readwrite').objectStore(storeName)
            const request = store.index(indexName).get(indexValue)
            //查询失败回调函数
            request.onerror = function () {
                console.log('查询失败')
            }
            //查询成功回调函数
            request.onsuccess = function (event) {
                let res = (event.target as IDBRequest).result
                // console.log(typeof (result));
                //返回成功查询数据
                resolve(res)
            }
        })
    }

    // 通过索引和游标【单一条件】查询多条匹配的数据（数据库对象，表名，索引名，索引值）
    cursorGetDataByIndex = (storeName: string, indexName: string, indexValue: string) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            let list: any[] = []
            const store = this.db!.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
            const request = store
                .index(indexName) // 索引对象
                .openCursor(IDBKeyRange.only(indexValue)) // 指针对象

            request.onsuccess = function (event) {
                const cursor = (event.target as IDBRequest).result
                if (cursor) {
                    // 必须要检查
                    list.push(cursor.value)
                    cursor.continue() // 遍历了存储对象中的所有内容
                } else {
                    // console.log("游标索引查询结果：", list);
                    resolve(list)
                }
            }
            request.onerror = function (e) {
                console.log('search error')
            }
        })
    }
    // 根据索引和游标【多重条件】查询多条匹配的数据（数据库对象，表名，索引名，多个索引值数组[]）
    mutipleSearchByIndex = (storeName: string, indexName: string, indexValues: any[]) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            let list: any[] = []
            const store = this.db!.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
            const request = store
                .index(indexName) // 索引对象
                .openCursor(IDBKeyRange.only(indexValues)) // 指针对象

            request.onsuccess = function (event) {
                const cursor = (event.target as IDBRequest).result
                if (cursor) {
                    // 必须要检查
                    list.push(cursor.value)
                    cursor.continue() // 遍历了存储对象中的所有内容
                } else {
                    // console.log("游标索引查询结果：", list);
                    console.log('读取数据成功')
                    resolve(list)
                }
            }
            request.onerror = function (e) {
                console.log('search error')
            }
        })
    }
    // 模糊查询
    fuzzySearch = (storeName: string, keyword: string) => {
        if (!this.db) {
            throw new Error("数据库未初始化");
        }
        return new Promise((resolve, reject) => {
            let list: any[] = []
            const store = this.db!.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
            const request = store.openCursor()

            request.onsuccess = function (event) {
                const cursor = (event.target as IDBRequest).result
                if (cursor) {
                    if (cursor.value.topic.indexOf(keyword) !== -1) {
                        // 必须要检查
                        list.push(cursor.value)
                    }
                    cursor.continue() // 遍历了存储对象中的所有内容
                } else {
                    // console.log("游标索引查询结果：", list);
                    resolve(list)
                }
            }
            request.onerror = function (e) {
                console.log('search error')
            }
        })
    }

    deleteIndexedDB = (name: string) => {
        window.indexedDB.deleteDatabase(name);
    }

}

export default DBEntry;