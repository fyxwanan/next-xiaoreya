import { scheduleJob, Job } from 'node-schedule';
import { v4 as uuidV4, UUIDTypes } from "uuid";
import DBEntry from "@/dto/memory/DBEntry";

type StartParams = {
    taskId?: string
}

export class Schedule {
    private job: Job | null = null;
    private taskMap: Map<string, boolean> = new Map();

    constructor() {
        this.initDatabase();
    }

    initDatabase() {

    }

    start(cronExpression: string, task: () => void) {
        const uuid = uuidV4();
        const job = scheduleJob(cronExpression, task);
    }

    stop(taskId: string) {

    }

    pause(taskId: string) {

    }

    resume(taskId: string) {

    }

    getStatus(taskId: string) {
        return !!this.taskMap.get(taskId);
    }
}