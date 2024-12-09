"use client"

import React, { useState, useMemo } from "react";
import type { FormProps } from "antd";
import { Button, Input, Form, Modal, message, Checkbox, DatePicker } from "antd";
import TaskStore, { TaskType } from "./TaskStore";
import dayjs from 'dayjs';

const { Item } = Form;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

type FieldType = TaskType;

interface Iprops {
    data?: TaskType | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    afterSubmit?: () => void;
}

const TaskFormDialog = (props: Iprops) => {
    const { data, open, setOpen, afterSubmit } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const initialData = useMemo(() => {
        if (!data) return {};
        const res = {
            ...data,
            time: [dayjs(data.startDate), dayjs(data.endDate)],
        };

        return res;
    }, [data])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        values = Object.assign(initialData, values)
        const rangeValue = values["time"];
        if (rangeValue) {
            values.startDate = rangeValue[0].format('YYYY-MM-DD HH:mm:ss');
            values.endDate = rangeValue[1].format('YYYY-MM-DD HH:mm:ss');
        }
        if (values?.id) {
            await TaskStore.instance.updateTask(values);
        } else {
            await TaskStore.instance.addTask(values);
        }
        setOpen(false);
        afterSubmit?.();
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        message.error(`Failed: ${errorInfo}`)
        setLoading(false);
    };

    const handleOK = async () => {
        setLoading(true);
        await form.submit();
        setLoading(false);
    }

    const handleCancel = async () => {
        setOpen(false);
    }

    return (
        <Modal
            title="新建任务"
            open={open}
            destroyOnClose
            footer={[
                <Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOK}>
                    确认
                </Button>
            ]}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={initialData}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Item<FieldType>
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: 'Please input your title!' }]}
                >
                    <Input />
                </Item>

                <Item<FieldType>
                    label="描述"
                    name="description"
                >
                    <TextArea />
                </Item>

                <Item<FieldType>
                    label="jira 链接"
                    name="jira_link"
                    rules={[{ required: true, message: 'Please input your jira_link!' }]}
                >
                    <Input />
                </Item>

                <Item<FieldType>
                    label="Git分支"
                    name="git_branchs"
                    rules={[{ required: true, message: 'Please input your git_branchs!' }]}
                >
                    <TextArea />
                </Item>

                <Item<FieldType>
                    label="迭代周"
                    name="iterationWeek"
                    rules={[{ required: false }]}
                >
                    <Input />
                </Item>

                <Item<FieldType>
                    label="是否发布"
                    name="is_public"
                    rules={[{ required: false }]}
                    valuePropName="checked"
                >
                    <Checkbox />
                </Item>

                <Item<FieldType>
                    label="时间"
                    name="time"
                    rules={[{ type: 'array' as const, required: true, message: 'Please select time!' }]}
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Item>

            </Form>
        </Modal>
    )
}

export default TaskFormDialog;