"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Condition(name, conditionFn) {
    return { Name: name, Condition: conditionFn };
}
exports.Condition = Condition;