import * as React from "react";
import { useState, useEffect } from "react";
import bookText from "./assets/1.txt";
import { Book } from "./utils/book";
import { Layout } from "./utils/layout";

import styles from "./index.less";

// 使用width指定宽度会在选择的时候留下空缺，应该使用letter-spacing，也可以是负值
export default function BookPage() {
    const [loading, setLoading] = useState(true);
    const [paraList, setParaList] = useState([]);

    useEffect(() => {
        const domChar = document.getElementById("measure-char");
        const domPage = document.getElementById("page-content");
        const book = new Book(bookText);
        const layout = new Layout(domChar, domPage, book);
        layout.setLineSpace(10);
        layout.setMargin(24, 24, 24, 24);
        layout.init();

        let list = [];
        for (let paraData of book.getParas()) {
            const { paraCharCodeArray, paraId, charBeginId } = paraData;
            let spanList = [];
            let charId = charBeginId;
            for (let charCode of paraCharCodeArray) {
                const char = String.fromCharCode(charCode);
                spanList.push(
                    <span key={charId} id={"char-" + charId}>
                        {char}
                    </span>
                );
                charId++;
            }
            list.push(<div key={paraId}>{spanList}</div>);
        }

        setParaList(list);
        setLoading(false);
    }, []);

    const handleClick = (e) => {
        // const str = window.getSelection().toString();
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>pageHeader</div>
            <div className={styles.pageContent} id="page-content">
                <div className={styles.measureChar}>
                    <span id="measure-char"></span>
                </div>
                {loading ? <div className={styles.pageLoading}>排版中...</div> : paraList}
            </div>
            <div className={styles.pageFooter}>pageFooter</div>
        </div>
    );
}
