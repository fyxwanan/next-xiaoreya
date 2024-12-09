"use client"

import React, { useMemo, memo, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";
import routerConfig, { RouterType } from "../router";

type MenuItem = Required<MenuProps>['items'][number];
type IMenuItem = MenuItem & {
    path: string;
    children?: IMenuItem[];
}

const Sidebar: React.FC = () => {
    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();
    const [selectKey, setSelectKey] = useState<string>("");
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [flatMenuList, setFlatMenuList] = useState<IMenuItem[]>([]);

    const menuList: IMenuItem[] = useMemo(() => {
        let initialSelectKey = "";
        const flatList: IMenuItem[] = [];

        const getMenuList = (data: RouterType[], level: number = 0): IMenuItem[] => {
            const list = data.map((item) => {
                if (pathName === item.path) {
                    initialSelectKey = item.id;
                }
                const res: IMenuItem = {
                    key: item.id,
                    label: item.title,
                    icon: item.icon,
                    path: item.path,
                    children: [],
                }
                if (item.children) {
                    // 默认展开第一级菜单
                    if (level === 0) {
                        openKeys.push(item.id);
                    }
                    res.children = getMenuList(item.children, level + 1)
                }
                if (res?.children && res?.children?.length === 0) {
                    delete res.children;
                }
                return res;
            })
            flatList.push(...list);
            return list;
        }

        const list = getMenuList(routerConfig, 0);
        setOpenKeys(Array.from(new Set(openKeys)));
        setSelectKey(initialSelectKey);
        setFlatMenuList(flatList);
        return list;
    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setSelectKey(e.key);
        const path = flatMenuList.find((item) => item.key === e.key)?.path;
        if (path) {
            router.push(path);
        }
    };

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys?: string[]) => {
        setOpenKeys(Array.from(new Set(openKeys)) || []);
    }

    return (
        <Menu
            onClick={onClick}
            onOpenChange={onOpenChange}
            style={{ width: 256 }}
            openKeys={openKeys}
            selectedKeys={[selectKey]}
            mode="inline"
            items={menuList}
            theme="dark"
        />
    );
};

export default memo(Sidebar);