import React, { useState, useEffect } from "react";
import styles from "./index.less";

import { user } from "@api/index";

import ExitSvg from "./exit.svg";

import Avatar from "@component/Avatar/index";
import Logo from "@component/Logo/index";

interface IProps {
    showBookshelf?: boolean;
    showHomework?: boolean;
}

export default function Header(props: IProps) {
    const [userInfo, setUserInfo] = useState<user.IUserInfo>(null);
    const { showBookshelf, showHomework } = props;

    useEffect(() => {
        user.getUserInfo().then((userInfo: user.IUserInfo) => {
            if (!userInfo) {
                window.location.href = "./login.html";
                return;
            }

            setUserInfo(userInfo);
        });
    }, []);

    async function handleLogout() {
        await user.logout();
        window.location.href = "./login.html";
    }

    function getItemList() {
        let itemList = [];
        if (showHomework) {
            itemList.push(
                <div
                    className={styles.headerItem}
                    onClick={() => (window.location.href = `./homework.html`)}
                    key="homework"
                >
                    <span>作业</span>
                </div>
            );
        }

        if (showBookshelf) {
            itemList.push(
                <div
                    className={styles.headerItem}
                    onClick={() => (window.location.href = `./bookshelf.html`)}
                    key="bookshelf"
                >
                    <span>书架</span>
                </div>
            );
        }

        return itemList;
    }

    return (
        <div className={styles.header}>
            <Logo />
            <div className={styles.headerRight}>
                {getItemList()}
                <div className={styles.headerItem} onClick={() => (window.location.href = `./userInfo.html`)}>
                    <Avatar userInfo={userInfo} showName />
                </div>
                <div className={styles.headerItem} onClick={handleLogout}>
                    <ExitSvg />
                </div>
            </div>
        </div>
    );
}
