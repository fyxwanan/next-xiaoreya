"use client"
import React, { CSSProperties } from "react";
import classNames from "classnames";

type PageContentProps = {
    className?: string;
    children?: React.ReactNode;
    style?: CSSProperties;
}

const PageContent = (props: PageContentProps) => {
    return (
        <div className={classNames("p-6 h-full overflow-y-auto", props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

export default PageContent;