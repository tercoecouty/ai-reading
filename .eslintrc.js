module.exports = {
    root: true,
    parser: "babel-eslint",
    extends: ["eslint:recommended", "plugin:react/recommended"],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        "react/prop-types": "off",
        "react/display-name": "off",
        "react/react-in-jsx-scope": "off",
    },
};
