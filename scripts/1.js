import api from "!../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js";
import content from "!!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/less-loader/dist/cjs.js!./index.less";

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);

if (module.hot) {
    if (!content.locals || module.hot.invalidate) {
        var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
            if ((!a && b) || (a && !b)) {
                return false;
            }

            var p;

            for (p in a) {
                if (isNamedExport && p === "default") {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (a[p] !== b[p]) {
                    return false;
                }
            }

            for (p in b) {
                if (isNamedExport && p === "default") {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (!a[p]) {
                    return false;
                }
            }

            return true;
        };
        var oldLocals = content.locals;

        module.hot.accept(
            "!!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/less-loader/dist/cjs.js!./index.less",
            function () {
                if (!isEqualLocals(oldLocals, content.locals, undefined)) {
                    module.hot.invalidate();

                    return;
                }

                oldLocals = content.locals;

                update(content);
            }
        );
    }

    module.hot.dispose(function () {
        update();
    });
}

export default content.locals || {};
