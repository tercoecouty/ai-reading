import * as React from "react";
import { render } from "react-dom";

import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import BookPage from "./BookPage";

const ReaderGUI = () => {
    return (
        <div>
            <LeftSide />
            <div>
                <BookPage />
                <BookPage />
            </div>
            <RightSide />
        </div>
    );
};

render(<ReaderGUI />, document.getElementById("root"));
