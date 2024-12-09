"use client"

import React, { useEffect, useState } from 'react';
import { Table, Tag, Badge, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import PageContent from '@/app/components/page_content';
import TaskStore, { TaskType } from './TaskStore';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import TaskFormDialog from './TaskFormDialog';



const TaskList: React.FC = () => {
    const [tasks, setTasks] = React.useState<TaskType[]>([]);
    const [taskOpen, setTaskOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TaskType | null>(null);

    useEffect(() => {
        getTaskList();
    }, []);


    const columns: TableColumnsType<TaskType> = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            fixed: 'left',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'jira链接',
            dataIndex: 'jira_link',
            key: 'jira_link',
        },
        {
            title: 'git 分支',
            dataIndex: 'git_branchs',
            key: 'git_branchs',
        },
        {
            title: '迭代周',
            dataIndex: 'iterationWeek',
            key: 'iterationWeek',
        },
        {
            title: '是否发布',
            dataIndex: 'is_public',
            key: 'is_public',
            width: 90,
            render: (text: string) => {
                return !!text ? "是" : "否";
            }
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
            fixed: "right",
            width: 100,
            render: (text: any, record: TaskType) => (
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

    const openModal = (record?: TaskType) => {
        setSelectedItem(record || null);
        setTaskOpen(true);
    }

    const handleDelete = async (record: TaskType) => {
        await TaskStore.instance.deleteTask(record.id as string);
        getTaskList();
    }

    const getTaskList = async () => {
        const taskList = await TaskStore.instance.getAll();
        setTasks(taskList);
    }

    const handleAfterSubmit = async () => {
        getTaskList();
    }

    return (
        <PageContent>
            <div className="flex justify-between items-center mb-[12px]">
                <div className="text-base font-medium">任务记录</div>
                <div className="flex items-center justify-center gap-[8px]">
                    <Button type="primary" onClick={() => openModal()}>
                        新建任务
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={tasks}
                scroll={{ x: 'max-content' }}
            />
            {
                taskOpen && (
                    <TaskFormDialog
                        open={taskOpen}
                        setOpen={setTaskOpen}
                        data={selectedItem}
                        afterSubmit={handleAfterSubmit}
                    />
                )
            }
        </PageContent>
    );
};

export default TaskList;