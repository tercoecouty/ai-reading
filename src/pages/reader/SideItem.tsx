import * as React from "react";

import MyNoteSvg from "./assets/my-note.svg";
import SearchSvg from "./assets/search.svg";
import TeamSvg from "./assets/team.svg";
import SettingsSvg from "./assets/settings.svg";
import ExitSvg from "./assets/exit.svg";
import FullScreenSvg from "./assets/full-screen.svg";
import ArrowLeftSvg from "./assets/arrow-left.svg";
import ArrowRightSvg from "./assets/arrow-right.svg";
import UnderlineSvg from "./assets/underline.svg";
import EditSvg from "./assets/edit.svg";
import HelpSvg from "./assets/help.svg";

const iconMap: Map<string, any> = new Map();
iconMap.set("search", <SearchSvg />);
iconMap.set("team", <TeamSvg />);
iconMap.set("settings", <SettingsSvg />);
iconMap.set("exit", <ExitSvg />);
iconMap.set("edit", <EditSvg />);
iconMap.set("underline", <UnderlineSvg />);
iconMap.set("help", <HelpSvg />);
iconMap.set("my-note", <MyNoteSvg />);
iconMap.set("full-screen", <FullScreenSvg />);
iconMap.set("arrow-left", <ArrowLeftSvg />);
iconMap.set("arrow-right", <ArrowRightSvg />);

import styles from "./index.less";

interface Props {
    title: string;
    icon: string;
    disabled?: boolean;
    color?: string;
}

export default function SideItem(props: Props) {
    const { icon, disabled } = props;

    return (
        <div className={styles.sideItem}>
            <span>{iconMap.get(icon)}</span>
        </div>
    );
}
