"use client"

import React, { useState, useEffect } from "react";
import IndexedDBStore from "@/dto/memory/IndexedDBStore";
import DBEntry, { StoresType, DBEntryOptionsType } from "@/dto/memory/DBEntry";
import { TaskStore, KnowledgeStore, UserStore, TodoStore } from "./indexedDBStores";


const DTATBASE_NAME = "app-xiaoreya";
const DATABASE_STORES: DBEntryOptionsType[] = [
    KnowledgeStore,
    UserStore,
    TaskStore,
    TodoStore
]

export const getDataBase = async () => {
    const db = await IndexedDBStore.instance.getDB(DTATBASE_NAME, DATABASE_STORES);
    return { db }
}

export const useGetDBInstance = () => {
    const [currentDB, setCurrentDB] = useState<DBEntry>();

    useEffect(() => {
        if (!currentDB) {
            getCurrentDB();
        }
    }, [currentDB]);
    const getCurrentDB = async () => {
        const db = await IndexedDBStore.instance.getDB(DTATBASE_NAME, DATABASE_STORES);
        setCurrentDB(db);
    }

    return { db: currentDB }
}

export const initIndexedDB = () => {
    return IndexedDBStore.instance.getDB(DTATBASE_NAME, DATABASE_STORES);
}

export const getAsyncDB = async () => {
    return await IndexedDBStore.instance.getDB(DTATBASE_NAME, DATABASE_STORES);
}