"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Button, Input, Form, Switch } from "antd";
import PageContent from "@components/page_content";
import { useKnowledgeBaseStore, KnowledgeBaseType } from "../KnowledgeBaseStore";

const { Item } = Form;
const { TextArea } = Input;

type FieldType = KnowledgeBaseType;

const CreateKnowledge = () => {

    const { db } = useKnowledgeBaseStore();
    const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const res = await db?.insertOne("knowledge", values)
        router.push("/knowledge/base")
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <PageContent>
            <div>Create Knowledge</div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Item<FieldType>
                    label="title"
                    name="title"
                    rules={[{ required: true, message: 'Please input your title!' }]}
                >
                    <Input />
                </Item>

                <Item<FieldType>
                    label="author"
                    name="author"
                    rules={[{ required: true, message: 'Please input your author!' }]}
                >
                    <Input />
                </Item>

                <Item<FieldType>
                    label="public"
                    name="public"
                    rules={[{ required: false }]}
                    initialValue={true}
                >
                    <Switch />
                </Item>


                <Item<FieldType>
                    label="content"
                    name="content"
                    rules={[{ required: true, message: 'Please input your content!' }]}
                >
                    <TextArea />
                </Item>


                <Item label={null}>
                    <Button type="primary" htmlType="submit">
                        添加知识
                    </Button>
                </Item>
            </Form>
            {/* <div>
                <Button onClick={() => handleAddKnowledge}>添加知识</Button>
            </div> */}
        </PageContent>
    )
}

export default CreateKnowledge;