import * as React from "react";
import SideItem from "./SideItem";

import styles from "./index.less";

export default function LeftSide() {
    return (
        <div className={styles.side}>
            <div>
                <SideItem title="我的批注" icon="my-note" />
                <SideItem title="搜索" icon="search" />
                <SideItem title="查看他人批注" icon="team" />
                <SideItem title="设置" icon="settings" />
            </div>
            <div>
                <SideItem title="退出" icon="exit" />
            </div>
        </div>
    );
}
