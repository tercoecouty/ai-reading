import React from "react";
import { render } from "react-dom";
import styles from "./index.less";
import Header from "@component/Header/index";

function Homework() {
    return (
        <React.Fragment>
            <Header showBookshelf />
            <div className={styles.homeworkList}>
                <div>homework</div>
                <div>homework</div>
                <div>homework</div>
            </div>
        </React.Fragment>
    );
}

render(<Homework />, document.getElementById("root"));
