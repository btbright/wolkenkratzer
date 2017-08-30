"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Set the Description of a template
 * @param {*} content
 */
function Description(content) {
    if (!content) {
        throw new SyntaxError(`New Description must have content.`);
    }
    return { kind: 'Description', Content: content };
}
exports.Description = Description;
//# sourceMappingURL=description.js.map