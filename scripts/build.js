const esbuild = require("esbuild");
const result = esbuild.transformSync(`<meta charset="UTF-8" />`, { loader: "html", minify: true });
console.log(result.code);
