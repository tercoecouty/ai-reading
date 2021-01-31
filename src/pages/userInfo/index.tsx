import React from "react";
import { render } from "react-dom";
import styles from "./index.less";
import Header from "@component/Header/index";

function UserInfo() {
    return (
        <React.Fragment>
            <Header showBookshelf showHomework />
        </React.Fragment>
    );
}

render(<UserInfo />, document.getElementById("root"));
