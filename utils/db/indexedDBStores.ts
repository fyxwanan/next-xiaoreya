import { DBEntryOptionsType } from "@/dto/memory/DBEntry";

export const TodoStore: DBEntryOptionsType = {
    keyPath: "id",
    autoIncrement: true,
    storeName: "todo",
    indexColumns: [
        {
            indexKey: "id",
            unique: true,
        },
        {
            indexKey: "title",
            unique: false,
        },
        {
            indexKey: "status",
            unique: false
        },
        {
            indexKey: "priority",
            unique: false
        },
    ]
}

export const TaskStore: DBEntryOptionsType = {
    keyPath: "id",
    autoIncrement: true,
    storeName: "task",
    indexColumns: [
        {
            indexKey: "id",
            unique: true,
        },
        {
            indexKey: "title",
            unique: false,
        },
        {
            indexKey: "description",
            unique: false
        },
        {
            indexKey: "git_branchs",
            unique: false
        },
        {
            indexKey: "jira_link",
            unique: false
        },
        {
            indexKey: "is_public",
            unique: false
        },
    ]
}

export const KnowledgeStore: DBEntryOptionsType = {
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
}

export const UserStore: DBEntryOptionsType = {
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