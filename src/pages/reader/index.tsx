import React from "react";
import ReactDOM from "react-dom";
import styles from "./index.less";

const ReaderGUI = () => {
    return (
        <div className={styles.reader}>
            <div className={styles.left}>left</div>
            <div className={styles.middle}>
                <div className={styles.page}>
                    <div className={styles.pageHead}>pageHead</div>
                    <div className={styles.pageContent}>pageContent</div>
                    <div className={styles.pageFoot}>pageFoot</div>
                </div>
                <div className={styles.page}>
                    <div className={styles.pageHead}>pageHead</div>
                    <div className={styles.pageContent}>pageContent</div>
                    <div className={styles.pageFoot}>pageFoot</div>
                </div>
            </div>
            <div className={styles.right}>right</div>
        </div>
    );
};

ReactDOM.render(<ReaderGUI />, document.getElementById("root"));
