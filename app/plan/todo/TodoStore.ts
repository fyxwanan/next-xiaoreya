import { getAsyncDB } from "@/utils/db/useGetDBInstance";
import type { Dayjs } from 'dayjs';

const TODO_OBJECT_STORE_NAME = "todo";

export enum TodoStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

export enum TodoPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface TodoType {
    id?: string;
    title: string;
    status: TodoStatus;
    priority: TodoPriority;
    time?: Array<Dayjs>;
    startDate: string;
    endDate: string;
}

class TodoStore {
    private static todoStore: TodoStore;

    public static get instance(): TodoStore {
        if (!TodoStore.todoStore) {
            TodoStore.todoStore = new TodoStore();
        }
        return TodoStore.todoStore;
    }


    public async getTodoById(id: string): Promise<TodoType | null> {
        const db = await getAsyncDB();
        db.search(TODO_OBJECT_STORE_NAME, id).then((result) => {

        });
        return null;
    }

    public async addTodo(data: TodoType): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.insertOne(TODO_OBJECT_STORE_NAME, data);
        return res;
    }

    public async updateTodo(data: TodoType): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.updateDB(TODO_OBJECT_STORE_NAME, data);
        return res;
    }

    public async deleteTodo(id: string): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.deleteOne(TODO_OBJECT_STORE_NAME, id);
        return res;
    }

    public async getAll(): Promise<TodoType[]> {
        const db = await getAsyncDB();
        return db.search(TODO_OBJECT_STORE_NAME);
    }
}

export default TodoStore;

export const getTodoStatusText = (status: TodoStatus) => {
    if (status === TodoStatus.DONE) {
        return "已完成";
    }
    if (status === TodoStatus.TODO) {
        return "代办";
    }
    if (status === TodoStatus.IN_PROGRESS) {
        return "进行中";
    }
    return "";
}

export const getTodoPriorityText = (priority: TodoPriority) => {
    if (priority === TodoPriority.HIGH) {
        return "高";
    }
    if (priority === TodoPriority.MEDIUM) {
        return "中";
    }
    if (priority === TodoPriority.LOW) {
        return "低";
    }
    return "";
}