"use client"
import dayjs from "dayjs";
import TaskStore from "../task/TaskStore";
import TodoStore from "../todo/TodoStore";

class CalendarStore {
    private static calendarStore: CalendarStore;

    public static get instance(): CalendarStore {
        if (!CalendarStore.calendarStore) {
            CalendarStore.calendarStore = new CalendarStore();
        }
        return CalendarStore.calendarStore;
    }


    getEventList = async () => {
        const tasks = await TaskStore.instance.getAll();
        const todos = await TodoStore.instance.getAll();
        const tasksWithType = tasks.map(task => ({
            ...task,
            type: 'task',
            start: task.startDate && dayjs(task.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            end: task.endDate && dayjs(task.endDate).format('YYYY-MM-DDTHH:mm:ss')
        }));

        const todosWithType = todos.map(todo => ({
            ...todo,
            type: 'todo',
            start: todo.startDate && dayjs(todo.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            end: todo.endDate && dayjs(todo.endDate).format('YYYY-MM-DDTHH:mm:ss')
        }));

        return [...tasksWithType, ...todosWithType];
    }

}

export default CalendarStore;