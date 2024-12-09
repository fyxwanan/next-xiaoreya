"use client"

import React, { useState, useMemo } from "react";
import type { FormProps } from "antd";
import { Button, Input, Form, Modal, message, Select, DatePicker } from "antd";
import TodoStore, { TodoType, TodoPriority, TodoStatus, getTodoStatusText, getTodoPriorityText } from "./TodoStore";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Item } = Form;
const { TextArea } = Input;
const { Option: SelectOption } = Select;
const { RangePicker } = DatePicker;

type FieldType = TodoType;

interface Iprops {
    data?: TodoType | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    afterSubmit?: () => void;
}

const TodoFormDialog = (props: Iprops) => {
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
            await TodoStore.instance.updateTodo(values);
        } else {
            await TodoStore.instance.addTodo(values);
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
            title="新建代办事项"
            open={open}
            destroyOnClose
            onClose={handleCancel}
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
                    <TextArea />
                </Item>

                <Item<FieldType>
                    label="状态"
                    name="status"
                    rules={[{ required: true }]}
                    initialValue={TodoStatus.TODO}
                >
                    <Select>
                        <SelectOption key={TodoStatus.TODO} value={TodoStatus.TODO}>{getTodoStatusText(TodoStatus.TODO)}</SelectOption>
                        <SelectOption key={TodoStatus.IN_PROGRESS} value={TodoStatus.IN_PROGRESS}>{getTodoStatusText(TodoStatus.IN_PROGRESS)}</SelectOption>
                        <SelectOption key={TodoStatus.DONE} value={TodoStatus.DONE}>{getTodoStatusText(TodoStatus.DONE)}</SelectOption>
                    </Select>
                </Item>

                <Item<FieldType>
                    label="优先级"
                    name="priority"
                    rules={[{ required: true }]}
                    initialValue={TodoPriority.MEDIUM}
                >
                    <Select>
                        <SelectOption key={TodoPriority.LOW} value={TodoPriority.LOW}>{getTodoPriorityText(TodoPriority.LOW)}</SelectOption>
                        <SelectOption key={TodoPriority.MEDIUM} value={TodoPriority.MEDIUM}>{getTodoPriorityText(TodoPriority.MEDIUM)}</SelectOption>
                        <SelectOption key={TodoPriority.HIGH} value={TodoPriority.HIGH}>{getTodoPriorityText(TodoPriority.HIGH)}</SelectOption>
                    </Select>
                </Item>

                <Item<FieldType>
                    label="时间"
                    name="time"
                    rules={[{ type: 'array' as const, required: true, message: 'Please select time!' }]}
                // getValueProps={(value) => ({ value: value && dayjs(Number(value)) })}
                // normalize={(value) => value && `${dayjs(value).valueOf()}`}
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Item>

            </Form>
        </Modal>
    )
}

export default TodoFormDialog;