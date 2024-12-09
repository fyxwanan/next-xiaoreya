"use client"

import React, { useState } from "react";
import { Button, List } from "antd";
import PageContent from "@components/page_content";
import useSWR from "swr";
import schedule from 'node-schedule';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Schedule() {

    const [open, setOpen] = useState<boolean>(false)
    // const $app = useSWR("/api/schedule", fetcher, { fallbackData: [] });
    // const { data, error } = $app;

    const handleScheduleClick = () => {
        if (/* 关闭定时任务 */ open) {
            // schedule.scheduleJob('* 20 19 * * *', () => {
            //     console.log("我是定时器，我要执行了，执行时间是 19.20")
            // })
        } else /* 打开定时任务 */ {
            const jobId = schedule.scheduleJob('0 50 19 * * *', () => {
                console.log("我是定时器，我要执行了，执行时间是 19.20", jobId)
            })
        }
        setOpen(!open)
    }

    return (
        <PageContent>
            <Button onClick={() => handleScheduleClick()} type="primary">
                {open ? "关闭" : "开启"}定时任务
            </Button>

        </PageContent>
    )
}