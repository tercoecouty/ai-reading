const esbuild = require("esbuild");
const less = require("less");
const path = require("path");
const fs = require("./fs");

const pluginName = "custom-plugin";
const isProd = process.env.NODE_ENV === "production";
const cssContent = {};

class CustomPlugin {
    constructor(options = {}) {
        this.template = options.template;
        this.pages = options.pages;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(pluginName, this.handleEmit);
        compiler.hooks.done.tapAsync(pluginName, this.handleDone);
    }

    handleEmit = (compilation, callback) => {
        // 提取 CSS 文件
        if (isProd) {
            compilation.chunks.forEach((chunk) => {
                const dir = path.parse(chunk.entryModule.resource).dir;
                let css = cssContent[dir];
                if (!css) return;

                const assetName = chunk.files[0].replace(/js$/, "css");
                compilation.assets[assetName] = {
                    source() {
                        return css;
                    },
                    size() {
                        return css.length;
                    },
                };
                chunk.files.push(assetName);
            });
        }

        // 生成 HTML 文件
        const html = fs.readFile(this.template);
        this.pages.forEach((item) => {
            const [pageName, pageTitle] = item;
            const chunk = compilation.chunks.find((chunk) => chunk.id === pageName);
            if (!chunk) return;

            let strScript = "";
            let strLink = "";
            let strTitle = `<title>${pageTitle}</title>`;

            if (isProd) {
                strScript += `<script src="react.production.min.js"></script>`;
                strScript += `<script src="react-dom.production.min.js"></script>`;
            } else {
                strScript += `<script src="react.development.js"></script>`;
                strScript += `<script src="react-dom.development.js"></script>`;
            }

            chunk.files.forEach((filename) => {
                if (filename.endsWith(".js")) {
                    strScript += `<script src="${filename}"></script>`;
                } else if (filename.endsWith(".css")) {
                    strLink += `<link href="${filename}" rel="stylesheet">`;
                }
            });

            let strHTML = html;
            strHTML = strHTML.replace("<!-- %link% -->", strLink);
            strHTML = strHTML.replace("<!-- %script% -->", strScript);
            strHTML = strHTML.replace("<!-- %title% -->", strTitle);

            const assetName = chunk.id + ".html";
            compilation.assets[assetName] = {
                source() {
                    return strHTML;
                },
                size() {
                    return strHTML.length;
                },
            };
        });

        callback();
    };

    handleDone = (compilation, callback) => {
        if (isProd) {
            fs.link("lib/react.production.min.js", "dist/react.production.min.js");
            fs.link("lib/react-dom.production.min.js", "dist/react-dom.production.min.js");
        } else {
            fs.link("lib/react.development.js", "dist/react.development.js");
            fs.link("lib/react-dom.development.js", "dist/react-dom.development.js");
        }

        fs.link("public/logo-96px.png", "dist/logo-96px.png");

        callback();
    };
}

async function customLoader(source) {
    let fileExtension = this.resourcePath.match(/\.[a-z]+$/);
    if (!fileExtension) return;

    fileExtension = fileExtension[0].slice(1);
    switch (fileExtension) {
        case "less":
            return await lessLoader(source, this.resourcePath);
        case "tsx":
        case "ts":
        case "txt":
            return await esbuildLoader(source, fileExtension);
    }

    return;
}

async function esbuildLoader(source, loader) {
    const result = await esbuild.transform(source, { loader });
    return result.code;
}

async function lessLoader(source, filename) {
    const result = await less.render(source, { filename });

    if (isProd) {
        // 如果是 prod mode，把编译的 CSS 文件保存起来，由 CustomPlugin 生成文件。
        const dir = path.parse(filename).dir;
        cssContent[dir] = result.css;
        return "";
    }

    // 如果不是 prod mode，那么通过 style 标签加载样式
    const css = result.css.replace(/\n+/g, "").replace(/ *([{:;]) +/g, "$1");

    const js = `
        let dom_style = document.getElementById("style");
        if (!dom_style) {
            dom_style = document.createElement("style");
            dom_style.setAttribute("id", "style");
            document.head.appendChild(dom_style);
        }
        dom_style.textContent = '${css}';

        if (module.hot) {
            module.hot.accept();
        }
    `;

    return js;
}

customLoader.CustomPlugin = CustomPlugin;
module.exports = customLoader;
