"use client"

import React, { CSSProperties } from "react";
import classNames from "classnames";
import { Tooltip } from "antd";

type ActionListType = {

}

type Iprops = {
    className?: string;
    children: React.ReactNode;
    style?: CSSProperties;
    actions?: ActionListType[]
}

const ActionList = (props: Iprops) => {
    const { children } = props;

    return (
        <div className={classNames("p-6 h-full overflow-y-auto", props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

export default ActionList;