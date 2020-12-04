const esbuild = require("esbuild");
const less = require("less");
const fs = require("fs");

module.exports = async function myLoader(source) {
    let fileExtension = this.resourcePath.match(/\.[a-z]+$/);
    if (!fileExtension) return;

    fileExtension = fileExtension[0].slice(1);
    switch (fileExtension) {
        case "less":
            return await myLessLoader(source, this.resourcePath);
        case "tsx":
        case "ts":
        case "txt":
            return await myEsbuildLoader(source, fileExtension);
    }

    return;
};

async function myEsbuildLoader(source, loader) {
    const result = esbuild.transformSync(source, { loader });
    return result.code;
    // esbuild.buildSync({
    //     entryPoints: [filePath],
    //     outfile: "dist/out.js",
    //     format: "esm",
    //     bundle: true,
    //     external: ["react", "react-dom", "*.less"],
    // });

    // const result = fs.readFileSync("dist/out.js", "utf-8");
    // return result;
}

async function myLessLoader(source, filename) {
    const result = await less.render(source, { filename });
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
