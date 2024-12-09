"use client"

import React, { useState } from "react";
import { CarryOutOutlined, ScheduleOutlined } from "@ant-design/icons"
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import TaskFormDialog from "../../task/TaskFormDialog";
import TodoFormDialog from "../../todo/TodoFormDialog";

export default function CreateActions() {
    const [taskOpen, setTaskOpen] = useState<boolean>(false);
    const [todoOpen, setTodoOpen] = useState<boolean>(false);
    const handleNew = (type: "task" | "todo") => {
        if (type === "task") {
            setTaskOpen(true);
        }
        if (type === "todo") {
            setTodoOpen(true);
        }
    }

    const items: MenuProps["items"] = [
        {
            key: "add-task",
            label: (
                <div onClick={() => handleNew("task")}>
                    新建任务
                </div>
            ),
            icon: <CarryOutOutlined />,
        },
        {
            key: "add-todo",
            label: (
                <div onClick={() => handleNew("todo")}>
                    新建代办
                </div>
            ),
            icon: <ScheduleOutlined />,
        },
    ];

    return (
        <>
            <Dropdown menu={{ items }}>
                {/* <PlusOutlined /> */}
                <Button type="primary">
                    新建
                </Button>
            </Dropdown>
            <TaskFormDialog open={taskOpen} setOpen={setTaskOpen} />
            <TodoFormDialog open={todoOpen} setOpen={setTodoOpen} />
        </>
    )
}