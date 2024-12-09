import React from "react";
import Image from "next/image";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";

const AppHeader = () => {

    const renderMenu = () => {
        const linkCls = "px-[12px] text-[var(--text-color)] hover:text-[var(--primary-color)] hover:opacity-80"

        return (
            <div className="flex flex-col py-[12px] gap-[12px]">
                <Link className={linkCls} href="/user">个人中心</Link>
                <Link className={linkCls} href="/user/setting">设置</Link>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center">
            <div className="pl-[48px]">
                <Image className="w-[100px]" src={require("@/assets/image/logo.jpg")} alt="xiaoreya" />
            </div>
            <div className="flex-1 w-full text-center">middle</div>
            <div className="pr-[20px]">
                <Tooltip
                    trigger="hover"
                    className="menu-box"
                    title={renderMenu()}
                    color="#151515"
                    overlayInnerStyle={{ padding: "0px", minWidth: "120px" }}
                    placement="bottomRight"
                >
                    <Avatar className="cursor-pointer" style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large" gap={0}>
                        X
                    </Avatar>
                </Tooltip>
            </div>
        </div>
    )
}

export default AppHeader;