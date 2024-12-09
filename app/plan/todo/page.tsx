"use client"

import React, { useEffect, useState } from 'react';
import type { PresetStatusColorType } from 'antd/es/_util/colors';
import { Table, Tag, Badge, Button } from 'antd';
import PageContent from '@/app/components/page_content';
import TodoStore, { TodoType, getTodoPriorityText, getTodoStatusText, TodoStatus, TodoPriority } from './TodoStore';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import TodoFormDialog from './TodoFormDialog';
import type { TableColumnsType } from 'antd';



const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [todoOpen, setTodoOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TodoType | null>(null);

    useEffect(() => {
        getToDoList();
    }, []);


    const columns: TableColumnsType<TodoType> = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            fixed: "left",
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => {
                let color: string;
                if (text === TodoStatus.DONE) {
                    color = 'green';
                } else if (text === TodoStatus.IN_PROGRESS) {
                    color = 'geekblue';
                } else {
                    color = '#42526e';
                }
                return (
                    <Tag color={color}>
                        {getTodoStatusText(text as TodoStatus)}
                    </Tag>
                )
            },
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            render: (text: string) => {
                let status: PresetStatusColorType;
                if (text === TodoPriority.HIGH) {
                    status = "error";
                } else if (text === TodoPriority.MEDIUM) {
                    status = "processing";
                } else {
                    status = "success";
                }
                return (
                    <Badge status={status} text={getTodoPriorityText(text as TodoPriority)} />
                )
            },
        },
        {
            title: "开始时间",
            dataIndex: "startDate",
            key: "startDate",
            width: 180,
        },
        {
            title: "结束时间",
            dataIndex: "endDate",
            key: "endDate",
            width: 180,
        },
        {
            title: "操作",
            dataIndex: "",
            key: "",
            width: 100,
            fixed: "right",
            render: (text: any, record: TodoType) => (
                <div className="flex items-center gap-[10px]">
                    <FormOutlined
                        className="cursor-pointer hover:text-[var(--primary-color)]"
                        onClick={() => openModal(record)}
                    />
                    <DeleteOutlined
                        className="cursor-pointer hover:text-[var(--primary-color)]"
                        onClick={() => handleDelete(record)}
                    />
                </div>
            ),
        }
    ];

    const openModal = (record?: TodoType) => {
        setSelectedItem(record || null);
        setTodoOpen(true);
    }

    const handleDelete = async (record: TodoType) => {
        await TodoStore.instance.deleteTodo(record.id as string);
        getToDoList();
    }

    const getToDoList = async () => {
        const todoList = await TodoStore.instance.getAll();
        setTodos(todoList);
    }

    const handleAfterSubmit = async () => {
        getToDoList();
    }

    return (
        <PageContent>
            <div className="flex justify-between items-center mb-[12px]">
                <div className="text-base font-medium">待办事项</div>
                <div className="flex items-center justify-center gap-[8px]">
                    <Button type="primary" onClick={() => openModal()}>
                        新建代办
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={todos}
            />
            {
                todoOpen && (
                    <TodoFormDialog
                        open={todoOpen}
                        setOpen={setTodoOpen}
                        data={selectedItem}
                        afterSubmit={handleAfterSubmit}
                    />
                )
            }
        </PageContent>
    );
};

export default TodoList;