const path = require("path");
const fs = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function getPath(suffix) {
    return path.resolve(__dirname, suffix);
}

fs.emptyDirSync("dist");
// fs.copySync("public", "dist/assets");

module.exports = {
    mode: "development",
    // mode: "production",
    entry: {
        reader: getPath("src/pages/reader/index.tsx"),
    },
    output: {
        filename: "[name].[hash:6].js",
        path: getPath("dist"),
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[local]-[hash:6]",
                            },
                        },
                    },
                    "less-loader",
                ],
            },
            { test: /\.tsx?$/, use: "babel-loader" },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].[hash:6].css" }),
        new HtmlWebpackPlugin({
            template: getPath("src/pages/reader/index.html"),
            chunks: ["reader"],
            filename: "reader.html",
        }),
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
    // devtool: "inline-source-map",
    devServer: {
        contentBase: getPath("dist"),
        hot: true,
    },
    optimization: {
        usedExports: true,
    },
};
