import React from "react";
import logoImg from "./logo.png";
import styles from "./index.less";

export default function Logo() {
    return (
        <span className={styles.logo}>
            <img src={logoImg} alt="logo" />
            <span>智慧阅读平台</span>
        </span>
    );
}
