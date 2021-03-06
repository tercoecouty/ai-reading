const path = require("path");
const fs = require("./utils/fs");
const CustomPlugin = require("./utils/custom-loader.js").CustomPlugin;

const getPath = (suffix) => path.resolve(__dirname, suffix);
const isDevelopment = process.env.NODE_ENV !== "production";

const entry = {};
const pages = [
    // ["login", "登录"],
    ["reader", "阅读器"],
    // ["userInfo", "用户信息"],
    // ["homework", "作业管理"],
    // ["bookshelf", "书架"]
];

fs.emptyDir("dist");

pages.forEach((item) => {
    const pageName = item[0];
    entry[pageName] = getPath(`src/pages/${pageName}/index.tsx`);
});

module.exports = {
    mode: isDevelopment ? "development" : "production",
    entry: entry,
    output: {
        filename: "[name].[hash:6].js",
        path: getPath("dist"),
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|less|txt)$/,
                use: getPath("utils/custom-loader.js"),
            },
        ],
    },
    plugins: [
        new CustomPlugin({
            template: getPath("src/pages/template.html"),
            pages,
        }),
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    devServer: {
        contentBase: "dist",
        hot: true,
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            "@root": getPath("."),
            "@src": getPath("src"),
            "@utils": getPath("utils"),
            "@api": getPath("src/api"),
        },
    },
};
