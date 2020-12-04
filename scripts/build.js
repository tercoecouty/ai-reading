const esbuild = require("esbuild");
const fs = require("fs");

esbuild.buildSync({
    entryPoints: ["src/pages/reader/index.tsx"],
    outfile: "dist/out.js",
    format: "esm",
    bundle: true,
    external: ["react", "react-dom", "*.less"],
});

console.log(fs.readFileSync("dist/out.js", "utf-8"));
