"use client"

import React, { useState, useEffect } from "react";
import IndexedDBStore from "@/dto/memory/IndexedDBStore";
import DBEntry, { StoresType, DBEntryOptionsType } from "@/dto/memory/DBEntry";

export type KnowledgeBaseType = {
    id?: number;
    title: string;
    author: string;
    public?: boolean;
    content: string;
}

const DTATBASE_NAME = "knowledge-base";
const DATABASE_STORES: DBEntryOptionsType[] = [
    {
        keyPath: "id",
        autoIncrement: true,
        storeName: "knowledge",
        indexColumns: [
            {
                indexKey: "title",
                unique: false
            },
            {
                indexKey: "content",
                unique: false
            }
        ]
    }, {
        keyPath: "userId",
        autoIncrement: false,
        storeName: "user",
        indexColumns: [
            {
                indexKey: "userId",
                unique: true,
            },
            {
                indexKey: "name",
                unique: false
            },
            {
                indexKey: "email",
                unique: false
            },
            {
                indexKey: "password",
                unique: false
            },
            {
                indexKey: "phone",
                unique: true
            }
        ]
    }
]

export const getDataBase = async () => {
    const db = await IndexedDBStore.instance.getDB(DTATBASE_NAME, DATABASE_STORES);
    return { db }
}

export const useKnowledgeBaseStore = () => {
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