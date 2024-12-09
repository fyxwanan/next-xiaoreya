export type RouterType = {
    id: string,
    title: string,
    path: string,
    icon: string,
    children?: RouterType[]
}

const routerConfig: RouterType[] = [
    {
        id: "home",
        title: "首页",
        path: "/home",
        icon: "",
    },
    {
        id: "schedule",
        title: "定时任务",
        path: "/schedule",
        icon: "",
    },
    {
        id: "plan",
        title: "计划",
        path: "/plan",
        icon: "",
        children: [
            {
                id: "plan-calendar",
                title: "日历",
                path: "/plan/calendar",
                icon: "",
            }, {
                id: "plan-todo",
                title: "代办事项",
                path: "/plan/todo",
                icon: "",
            }, {
                id: "plan-task",
                title: "任务集",
                path: "/plan/task",
                icon: "",
            }
        ]
    },
    {
        id: "knowledge",
        title: "知识库",
        path: "/knowledge",
        icon: "",
        children: [
            {
                id: "knowledge-base",
                title: "知识空间",
                path: "/knowledge/base",
                icon: "",
            }
        ]
    }
];

export default routerConfig;