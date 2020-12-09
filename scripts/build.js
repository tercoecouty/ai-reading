const child_process = require("child_process");
process.env.NODE_ENV = "production";
child_process.execFile("node", ["scripts/child.js"], (error, stdout) => {
    if (error) {
        console.log(error.toString());
        return;
    }

    console.log(stdout);
});
