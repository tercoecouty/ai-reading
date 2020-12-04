import * as React from "react";
import { render } from "react-dom";
import "./index.less";
import print from "./print";

const ReaderGUI = () => {
    return <div>Login</div>;
};

print();

render(<ReaderGUI />, document.getElementById("root"));
