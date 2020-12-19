import * as React from "react";
import SideItem from "./SideItem";

export default function RightSide() {
    return (
        <div className="side">
            <div>
                <SideItem title="全屏" icon="full-screen" />
                <SideItem title="上一页" icon="arrow-left" />
                <SideItem title="下一页" icon="arrow-right" />
                <SideItem title="划线" icon="underline" disabled />
                <SideItem title="编辑" icon="edit" disabled />
            </div>
            <div>
                <SideItem title="帮助" icon="help" />
            </div>
        </div>
    );
}
