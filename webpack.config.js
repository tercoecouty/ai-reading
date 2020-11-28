const path = require("path");
const fs = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");

function getPath(suffix) {
    return path.resolve(__dirname, suffix);
}

fs.emptyDirSync("dist");

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
                                localIdentName: "[local]_[hash:6]",
                            },
                        },
                    },
                    "less-loader",
                ],
            },
            {
                test: /\.tsx$/,
                loader: "esbuild-loader",
                options: { target: "esnext", loader: "tsx" },
            },
            {
                test: /\.ts$/,
                loader: "esbuild-loader",
                options: { target: "esnext", loader: "ts" },
            },
            {
                test: /\.txt$/,
                loader: "esbuild-loader",
                options: { loader: "text" },
            },
        ],
    },
    plugins: [
        new ESBuildPlugin(),
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
    optimization: {
        minimize: true,
        minimizer: [new ESBuildMinifyPlugin()],
    },
    devServer: {
        contentBase: getPath("dist"),
        hot: true,
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    // devtool: "inline-source-map",
};
