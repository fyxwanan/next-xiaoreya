"use client"
import React from "react";
import { Button, Result } from 'antd';
import { useRouter } from "next/navigation";

export default function NotFoundPage() {

    const router = useRouter();

    const handleBackHome = () => {
        router.push("/home");
    }

    return (
        <Result
            className="mt-[40px]"
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button onClick={() => handleBackHome()} type="primary">Back Home</Button>}
        />
    )
} 