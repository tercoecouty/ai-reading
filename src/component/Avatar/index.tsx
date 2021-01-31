import React from "react";
import DefaultAvatarSvg from "./default-avatar.svg";
import styles from "./index.less";
import { user } from "@api/index";
import avatarImg from "./avatar.jpg";

interface IProps {
    userInfo: user.IUserInfo;
    showName?: boolean;
}

let img = avatarImg;

export default function Avatar(props: IProps) {
    if (!props.userInfo) return null;

    const { userName, userAvatarUrl } = props.userInfo;

    function showUserName() {
        if (!props.showName) return null;

        return <span className={styles.userName}>{userName}</span>;
    }

    if (!userAvatarUrl) {
        return (
            <div className={styles.container}>
                <span className={styles.avatar}>
                    <span className={styles.avatarBackground}>
                        <DefaultAvatarSvg />
                    </span>
                </span>
                {showUserName()}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <span className={styles.avatar}>
                <img src={userAvatarUrl} alt="avatar" />
            </span>
            {showUserName()}
        </div>
    );
}
