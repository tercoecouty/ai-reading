const esbuild = require("esbuild");
const less = require("less");
const path = require("path");
const utils = require("./utils");

const pluginName = "custom-plugin";
const isProd = process.env.NODE_ENV === "production";
const cssContent = {};

class CustomPlugin {
    constructor(pages = []) {
        this.pages = pages;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(pluginName, this.handleEmit);
        compiler.hooks.done.tapAsync(pluginName, this.handleDone);
    }

    handleEmit = (compilation, callback) => {
        // 提取 CSS 文件
        // if (isProd) {
        //     compilation.chunks.forEach((chunk) => {
        //         let resource = "";
        //         if (chunk.entryModule.rootModule) {
        //             resource = chunk.entryModule.rootModule.resource;
        //         } else {
        //             resource = chunk.entryModule.resource;
        //         }
        //         if (!resource) return;

        //         const dir = path.parse(resource).dir;
        //         let css = cssContent[dir];
        //         if (!css) return;

        //         const assetName = chunk.files[0].replace(/js$/, "css");
        //         compilation.assets[assetName] = {
        //             source() {
        //                 return css;
        //             },
        //             size() {
        //                 return css.length;
        //             },
        //         };
        //         chunk.files.push(assetName);
        //     });
        // }

        // 生成 HTML 文件
        const templatePath = path.resolve(__dirname, "../src/pages/template.html");
        const html = utils.readFile(templatePath);
        this.pages.forEach((item) => {
            const [pageName, pageTitle] = item;
            const chunk = compilation.chunks.find((chunk) => chunk.name === pageName);
            if (!chunk) return;

            let strScript = "";
            let strLink = "";
            let strTitle = `<title>${pageTitle}</title>`;

            if (isProd) {
                strScript += `<script src="assets/react.production.min.js"></script>`;
                strScript += `<script src="assets/react-dom.production.min.js"></script>`;
            } else {
                strScript += `<script src="assets/react.development.js"></script>`;
                strScript += `<script src="assets/react-dom.development.js"></script>`;
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

            const assetName = chunk.name + ".html";
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
            utils.link("lib/react.production.min.js", "dist/assets/react.production.min.js");
            utils.link("lib/react-dom.production.min.js", "dist/assets/react-dom.production.min.js");
        } else {
            utils.link("lib/react.development.js", "dist/assets/react.development.js");
            utils.link("lib/react-dom.development.js", "dist/assets/react-dom.development.js");
        }

        utils.link("./logo-96px.png", "dist/assets/logo-96px.png");

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
            return await esbuildLoader(source, fileExtension);
        case "svg":
            return await svgLoader(source);
        case "txt":
            return await rawLoader(source);
        case "png":
        case "jpg":
            return await fileLoader(this.resourcePath);
    }

    return;
}

async function rawLoader(source) {
    const js = `
        const text = \`${source}\`;
        export default text;
    `;

    return js;
}

async function fileLoader(filePath) {
    // todo
    const basename = path.basename(filePath);
    utils.copyFile(filePath, "dist/assets/" + basename);

    const fileUrl = "assets/" + path.basename(filePath);
    const js = `
        const path = "${fileUrl}";
        export default path;
    `;

    return js;
}

async function svgLoader(source) {
    const tsx = `
        import * as React from "react";
        export default function Svg(){
            return (
                ${source}
            );
        }
    `;

    const js = await esbuildLoader(tsx, "tsx");
    return js;
}

async function esbuildLoader(source, loader) {
    const result = await esbuild.transform(source, { loader });
    return result.code;
}

async function lessLoader(source, filename) {
    const result = await less.render(source, { filename });

    // if (isProd) {
    //     // 如果是 prod mode，把编译的 CSS 文件保存起来，由 CustomPlugin 生成文件。
    //     const dir = path.parse(filename).dir;
    //     cssContent[dir] = result.css;
    //     return "";
    // }

    // 如果不是 prod mode，那么通过 style 标签加载样式
    // 压缩css
    let css = result.css.replace(/\n+/g, "").replace(/ *([:{;]) +/g, "$1");

    const hash = utils.hash(filename).slice(0, 8);
    const styleId = "style-" + hash;
    const classNameList = Array.from(css.matchAll(/\.([a-zA-Z]+?)[ {,]/g)).map((match) => match[1]);
    const styles = {};

    for (const className of new Set(classNameList)) {
        const hashedClassName = `${className}-${hash}`;
        let regex = new RegExp(`\\.${className}([ {,:])`, "g");
        css = css.replace(regex, `.${hashedClassName}$1`);
        styles[className] = hashedClassName;
    }

    const js = `
        let dom_style = document.getElementById("${styleId}");
        if (!dom_style) {
            dom_style = document.createElement("style");
            dom_style.setAttribute("id", "${styleId}");
            document.head.appendChild(dom_style);
        }
        dom_style.textContent = '${css}';

        if (module.hot) {
            module.hot.accept();
        }

        const styles = ${JSON.stringify(styles)};
        export default styles;
    `;

    return js;
}

customLoader.CustomPlugin = CustomPlugin;
module.exports = customLoader;
