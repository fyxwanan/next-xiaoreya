import type { Dayjs } from "dayjs";
import { getAsyncDB } from "@/utils/db/useGetDBInstance";

const TASK_OBJECT_STORE_NAME = "task";

export interface TaskType {
    id?: string;
    title: string;
    description: string;
    iterationWeek?: string;
    jira_link?: string;
    git_branchs?: string;
    is_public?: boolean;
    time?: Array<Dayjs>;
    startDate: string;
    endDate: string;
}

class TaskStore {
    private static taskStore: TaskStore;

    public static get instance(): TaskStore {
        if (!TaskStore.taskStore) {
            TaskStore.taskStore = new TaskStore();
        }
        return TaskStore.taskStore;
    }


    public async getTaskById(id: string): Promise<TaskType | null> {
        const db = await getAsyncDB();
        db.search(TASK_OBJECT_STORE_NAME, id).then((result) => {

        });
        return null;
    }

    public async addTask(data: TaskType): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.insertOne(TASK_OBJECT_STORE_NAME, data);
        return res;
    }

    public async updateTask(data: TaskType): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.updateDB(TASK_OBJECT_STORE_NAME, data);
        return res;
    }

    public async deleteTask(id: string): Promise<any> {
        const db = await getAsyncDB();
        const res = await db.deleteOne(TASK_OBJECT_STORE_NAME, id);
        return res;
    }

    public async getAll(): Promise<TaskType[]> {
        const db = await getAsyncDB();
        return db.search(TASK_OBJECT_STORE_NAME);
    }
}

export default TaskStore;