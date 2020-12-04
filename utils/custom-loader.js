const esbuild = require("esbuild");
const less = require("less");
const path = require("path");
const fs = require("fs");

const pluginName = "custom-plugin";
const isProd = process.env.NODE_ENV === "production";
const cssContent = {};

class CustomPlugin {
    constructor(options = {}) {
        this.template = options.template;
        this.pages = options.pages;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(pluginName, this.handle);
    }

    handle = (compilation, callback) => {
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
        const html = fs.readFileSync(this.template).toString();
        this.pages.forEach((item) => {
            const [pageName, pageTitle] = item;
            const chunk = compilation.chunks.find((chunk) => chunk.id === pageName);
            if (!chunk) return;

            let strScript = "";
            let strLink = "";
            let strTitle = `<title>${pageTitle}</title>`;

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

customLoader.CustomPlugin = CustomPlugin;

async function esbuildLoader(source, loader) {
    const result = esbuild.transformSync(source, { loader });
    return result.code;
}

async function lessLoader(source, filename) {
    const result = await less.render(source, { filename });

    if (isProd) {
        const dir = path.parse(filename).dir;
        cssContent[dir] = result.css;
        return "";
    }

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

module.exports = customLoader;
