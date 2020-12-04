const less = require("less");

function getJS(css) {
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

module.exports = async function myLoader(source) {
    const result = await less.render(source, { filename: this.resourcePath });
    const css = result.css.replace(/\n+/g, "").replace(/ *([{:;]) +/g, "$1");

    return getJS(css);
};
