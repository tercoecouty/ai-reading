const path = require("path");
const utils = require("./scripts/utils");
const CustomPlugin = require("./scripts/loader.js").CustomPlugin;

const isDevelopment = process.env.NODE_ENV !== "production";

const entry = {};
const pages = [
    // ["login", "登录"],
    // ["bookshelf", "书架"],
    ["reader", "阅读器"],
    // ["userInfo", "个人信息"],
    // ["homework", "作业"],
];

utils.emptyDir("dist");

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
                test: /\.(tsx|ts|less|svg|txt|png|jpg)$/,
                use: getPath("scripts/loader.js"),
            },
        ],
    },
    plugins: [new CustomPlugin(pages)],
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
            "@svg": getPath("src/svg"),
            "@utils": getPath("src/utils"),
            "@api": getPath("src/api"),
            "@component": getPath("src/component"),
        },
    },
};

function getPath(suffix) {
    return path.resolve(__dirname, suffix);
}
