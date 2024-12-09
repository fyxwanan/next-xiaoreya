"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, List, Avatar, Space, Empty } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import PageContent from "@components/page_content";
import { useKnowledgeBaseStore, KnowledgeBaseType } from "../KnowledgeBaseStore";


const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const KnowledgeBase = () => {

    const { db } = useKnowledgeBaseStore();
    const [data, setData] = useState<KnowledgeBaseType[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (db?.getInitialize()) {
            getKnowledgeList();
        }
    }, [db?.getInitialize()])
    const handleNew = () => {
        router.push("/knowledge/create")
    }

    const getKnowledgeList = async () => {
        console.log("getKnowledgeList ===>")
        const res = await db!.search("knowledge");
        setData(res);
    }

    const renderPageHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-base font-medium">知识空间</div>
                <div className="flex gap-2 items-center justify-end">
                    <Button type="primary" onClick={() => handleNew()}>新建</Button>
                </div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <>
                {renderPageHeader()}
                <PageContent style={{ height: "calc(100% - 50px)" }}>
                    <Empty description={false} />
                </PageContent>
            </>
        )
    }

    return (
        <>
            {renderPageHeader()}
            <PageContent style={{ height: "calc(100% - 50px)" }}>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={data}
                    footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            {item.content}
                        </List.Item>
                    )}
                />
            </PageContent>
        </>
    )
}

export default KnowledgeBase;