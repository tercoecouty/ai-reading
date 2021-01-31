import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { user } from "@api/index";
import styles from "./index.less";

const Login = () => {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        setAccount("20180001");
        setPassword("123456");
    }, []);

    useEffect(() => {
        if (!alertMessage) return;

        setAlertMessage("");
    }, [account, password]);

    async function handleLogin(e) {
        e.preventDefault();

        if (account === "" || password === "") {
            setAlertMessage("请输入账号和密码");
            return;
        }

        const isValid = await user.login(account, password);
        if (isValid) {
            window.location.href = "./bookshelf.html";
            return;
        }

        setAccount("");
        setPassword("");
        setAlertMessage("账号或密码错误");
    }

    function showAlert() {
        if (alertMessage === "") return null;

        return <div className={styles.alertMessage}>{alertMessage}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <h1>智慧阅读平台</h1>
                {showAlert()}
                <form onSubmit={handleLogin}>
                    <label htmlFor="input-account">账号</label>
                    <input
                        id="input-account"
                        type="text"
                        placeholder="请输入你的账号"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <label htmlFor="input-password">密码</label>
                    <input
                        type="password"
                        placeholder="请输入你的密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">登录</button>
                </form>
            </div>
        </div>
    );
};

render(<Login />, document.getElementById("root"));
