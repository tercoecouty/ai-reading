import * as React from "react";
import { render } from "react-dom";
import styles from "./index.less";

import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import BookPage from "./BookPage";

const ReaderGUI = () => {
    if (detectMobile()) {
        return <div>不支持在手机端使用阅读器。</div>;
    }

    return (
        <div className={styles.reader}>
            <LeftSide />
            <div className={styles.pageContainer}>
                <BookPage />
                {/* <BookPage /> */}
            </div>
            <RightSide />
        </div>
    );
};

function detectMobile() {
    const agent = window.navigator.userAgent;
    return /(Android|iPhone|iPad)/i.test(agent);
}

render(<ReaderGUI />, document.getElementById("root"));
