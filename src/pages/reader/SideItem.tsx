import * as React from "react";
import { classnames } from "@utils/index";

import MyNoteSvg from "@svg/my-note.svg";
import SearchSvg from "@svg/search.svg";
import TeamSvg from "@svg/team.svg";
import SettingsSvg from "@svg/settings.svg";
import ExitSvg from "@svg/exit.svg";
import FullScreenSvg from "@svg/full-screen.svg";
import ArrowLeftSvg from "@svg/arrow-left.svg";
import ArrowRightSvg from "@svg/arrow-right.svg";
import UnderlineSvg from "@svg/underline.svg";
import EditSvg from "@svg/edit.svg";
import HelpSvg from "@svg/help.svg";

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

interface Props {
    title: string;
    icon: string;
    disabled?: boolean;
    color?: string;
}

export default function SideItem(props: Props) {
    const { icon, disabled } = props;

    const className = classnames({
        "side-item": true,
        "side-item-disabled": disabled,
    });

    return (
        <div className={className}>
            <span>{iconMap.get(icon)}</span>
        </div>
    );
}
