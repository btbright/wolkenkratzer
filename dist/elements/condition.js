(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash", "../intrinsic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const lodash_1 = require("lodash");
    const intrinsic_1 = require("../intrinsic");
    /**
     * Create a Condition object
     * @param {*} name
     * @param {*} conditionFn
     */
    function Condition(name, conditionFn) {
        let newCondFn = lodash_1.cloneDeep(conditionFn);
        if (typeof newCondFn === 'object' && !newCondFn.kind) {
            newCondFn = intrinsic_1.buildIntrinsic(newCondFn);
        }
        return { kind: 'Condition', Name: name, Condition: newCondFn };
    }
    exports.Condition = Condition;
});
//# sourceMappingURL=condition.js.map