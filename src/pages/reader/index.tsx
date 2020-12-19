import * as React from "react";
import { render } from "react-dom";
import { detectMobile } from "@utils/index";
import "./index.less";

import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import BookPage from "./BookPage";

const ReaderGUI = () => {
    if (detectMobile()) {
        return <div>不支持在手机端使用阅读器。</div>;
    }

    return (
        <div className="reader">
            <LeftSide />
            <div className="page-container">
                <BookPage />
                {/* <BookPage /> */}
            </div>
            <RightSide />
        </div>
    );
};

render(<ReaderGUI />, document.getElementById("root"));
