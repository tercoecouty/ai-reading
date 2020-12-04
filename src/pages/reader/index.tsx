import * as React from "react";
import { render } from "react-dom";
import "./index.less";

import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import BookPage from "./BookPage";

const ReaderGUI = () => {
    return (
        <div className="reader">
            <LeftSide />
            <div className="page-container">
                <BookPage />
                <BookPage />
            </div>
            <RightSide />
        </div>
    );
};

render(<ReaderGUI />, document.getElementById("root"));
