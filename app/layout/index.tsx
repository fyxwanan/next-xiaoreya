"use client";

import React, { useEffect } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Flex, Layout, ConfigProvider } from 'antd';
import { initIndexedDB } from "@/utils/db/useGetDBInstance";
import theme from "./themeConfig";
import Sidemenu from "./sidebar";
import AppHeader from "./header";

const { Header, Sider, Content } = Layout;

type AppLayoutProps = {
    content: React.ReactNode,
    header?: React.ReactNode,
    sidebar?: React.ReactNode,
}

const AppLayout = (props: AppLayoutProps) => {
    const { content } = props;

    useEffect(() => {
        initIndexedDB();
    }, [])

    const headerStyle: React.CSSProperties = {
        color: '#fff',
        height: 64,
        lineHeight: '64px',
        padding: 0,
    };

    const contentStyle: React.CSSProperties = {
        height: 'calc(100vh - 64px)',
        overflow: "auto"
    };

    const siderStyle: React.CSSProperties = {
        lineHeight: '120px',
        color: '#fff',
        height: 'calc(100vh - 64px)'
    };

    const layoutStyle = {
        overflow: 'hidden',
        width: 'calc(100%)',
        maxWidth: 'calc(100%)',
    };

    return (
        <AntdRegistry>
            <Flex gap="middle" wrap>
                <Layout style={layoutStyle}>
                    <Header style={headerStyle}>
                        <AppHeader />
                    </Header>
                    <Layout>
                        <Sider width="256px" style={siderStyle}>
                            <Sidemenu />
                        </Sider>
                        <Content style={contentStyle}>
                            {content}
                        </Content>
                    </Layout>
                </Layout>
            </Flex>
        </AntdRegistry>
    )
}

export default AppLayout;