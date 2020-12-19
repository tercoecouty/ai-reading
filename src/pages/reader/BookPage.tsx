import * as React from "react";
import { useState, useEffect } from "react";
import text from "./1.txt";
import Parser from "./parser";

// 使用width指定宽度会在选择的时候留下空缺，应该使用letter-spacing，也可以是负值
export default function BookPage() {
    const [loading, setLoading] = useState(true);
    const [paraList, setParaList] = useState([]);

    useEffect(() => {
        const list = text.split("\n").map((line, index) => {
            if (!line) return null;

            const spanList = Array.from(line).map((char, index) => {
                return <span key={index}>{char}</span>;
            });
            return <div key={index}>{spanList}</div>;
        });

        setParaList(list);
        setLoading(false);
    }, []);

    // useEffect(() => {
    //     const dom_span = document.getElementById("char-measure");
    //     const dom_page = document.getElementById("page-content");
    //     const text = "你好，abc。\nGood to see you.";
    //     console.time("parser");
    //     const parser = new Parser();
    //     parser.preprocess(text);
    //     parser.measure(dom_span, dom_page);
    //     parser.encodeItems();
    //     console.timeEnd("parser");
    //     console.log(parser);
    // }, []);

    const handleClick = (e) => {
        // const str = window.getSelection().toString();
    };

    return (
        <div className="page">
            <div className="page-header">pageHeader</div>
            <div className="page-content" id="page-content">
                <div className="char-measure">
                    <span id="char-measure"></span>
                </div>
                {loading ? <div className="page-loading">排版中...</div> : paraList}
            </div>
            <div className="page-footer">pageFooter</div>
        </div>
    );
}
