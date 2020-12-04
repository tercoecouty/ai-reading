const path = require("path");
const fs = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");

const getPath = (suffix) => path.resolve(__dirname, suffix);

const isDevelopment = process.env.NODE_ENV !== "production";

const pages = [];
const entry = {};
const plugins = [];
plugins.push(new ESBuildPlugin());
if (!isDevelopment) plugins.push(new MiniCssExtractPlugin());

// pages.push(["reader", "阅读器"]);
pages.push(["login", "登录"]);
// pages.push(["userInfo", "用户信息"]);
// pages.push(["homework", "作业管理"]);
// pages.push(["bookshelf", "书架"]);

fs.emptyDirSync("dist");

pages.forEach((item) => {
    const [pageName, pageTitle] = item;
    entry[pageName] = getPath(`src/pages/${pageName}/index.tsx`);
    plugins.push(
        new HtmlWebpackPlugin({
            template: getPath(`src/pages/template.html`),
            chunks: [pageName],
            filename: `${pageName}.html`,
            title: pageTitle,
        })
    );
});

module.exports = {
    mode: isDevelopment ? "development" : "production",
    entry: entry,
    plugins: plugins,
    output: {
        filename: "[name].[hash:6].js",
        path: getPath("dist"),
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|less|txt)$/,
                use: "my-loader",
            },
        ],
    },
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
    },
    resolveLoader: {
        modules: ["loader"],
    },
    optimization: {
        minimize: true,
        minimizer: [new ESBuildMinifyPlugin()],
    },
};
