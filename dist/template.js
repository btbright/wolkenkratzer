"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function Template() {
    return {
        AWSTemplateFormatVersion: '2010-09-09',
        Conditions: {},
        Outputs: {},
        Parameters: {},
        Resources: {},
        add: function (e) {
            switch (e.kind) {
                case 'Condition':
                    return _addCondition(this, e);
                case 'Parameter':
                    return _addParameter(this, e);
                case 'Output':
                    return _addOutput(this, e);
                case 'Resource':
                    return _addResource(this, e);
                case 'Description':
                    return _addDescription(this, e);
                default:
                    throw new SyntaxError(`${JSON.stringify(e)} is not a valid type, could not be added.`);
            }
        },
        build: function () {
            let result = {
                AWSTemplateFormatVersion: '2010-09-09',
                Resources: {}
            };
            if (Object.keys(this.Conditions).length > 0) {
                result.Conditions = {};
                Object.keys(this.Conditions).map(c => {
                    result.Conditions[c] = _json(this.Conditions[c]);
                });
            }
            if (Object.keys(this.Parameters).length > 0) {
                result.Parameters = {};
                Object.keys(this.Parameters).map(p => {
                    result.Parameters[p] = _json(this.Parameters[p]);
                });
            }
            if (Object.keys(this.Outputs).length > 0) {
                result.Outputs = {};
                Object.keys(this.Outputs).map(o => {
                    result.Outputs[o] = _json(this.Outputs[o]);
                });
            }
            if (Object.keys(this.Resources).length > 0) {
                result.Resources = {};
                Object.keys(this.Resources).map(r => {
                    result.Resources[r] = _json(this.Resources[r]);
                });
            }
            if (this.Description) {
                result.Description = this.Description;
            }
            return result;
        },
        kind: 'Template',
        remove: function (e) {
            let result = Object.assign({}, this);
            let element;
            if (typeof e === 'string') {
                let parameter = result.Parameters[e];
                if (parameter) {
                    element = parameter;
                }
                else {
                    let output = result.Outputs[e];
                    if (output) {
                        element = output;
                    }
                    else {
                        throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
                    }
                }
            }
            else {
                element = e;
            }
            switch (element.kind) {
                /*case 'Condition':
                    return _removeCondition(this, e);*/
                case 'Parameter':
                    return _removeParameter(this, element);
                case 'Output':
                    return _removeOutput(this, element);
                /*case 'Resource':
                    return _removeResource(this, e);*/
                // case 'Description':
                //    return _removeDescription(this, element);
                default:
                    throw new SyntaxError(`${JSON.stringify(e)} is not a valid type, could not be added.`);
            }
        },
        removeDescription: function () {
            const _a = this, { Description } = _a, remaining = __rest(_a, ["Description"]);
            return remaining;
        }
    };
}
exports.Template = Template;
function _validateRef(t, ref) {
    if (ref.Ref) {
        if (!(t.Parameters[ref.Ref] || t.Resources[ref.Ref])) {
            throw new SyntaxError(`Could not find ${JSON.stringify(ref)}`);
        }
    }
    return;
}
function _validateFnGetAtt(t, getatt) {
    if (!(t.Resources[getatt['Fn::GetAtt'][0]])) {
        throw new SyntaxError(`Could not find ${JSON.stringify(getatt)}`);
    }
    return;
}
function _strip(t) {
    let { kind, Name } = t, rest = __rest(t, ["kind", "Name"]);
    return rest;
}
function _stripKind(intrinsic) {
    let { kind } = intrinsic, rest = __rest(intrinsic, ["kind"]);
    return rest;
}
function _buildResource(t) {
    let { Type, Properties } = t;
    let newProps = {};
    if (Properties) {
        Object.keys(Properties).map(p => {
            if (Properties[p].kind) {
                newProps[p] = _stripKind(Properties[p]);
            }
            else {
                newProps[p] = Properties[p];
            }
        });
    }
    return { Type, Properties: newProps };
}
function _buildCondition(t) {
    let { Condition } = t;
    let { kind } = Condition, conditionFn = __rest(Condition, ["kind"]);
    let result = _stripKind(conditionFn);
    Object.keys(result).map(k => {
        result[k][0] = _stripKind(result[k][0]);
    });
    return result;
}
function _buildOutput(t) {
    let outputResult = Object.assign({}, t.Properties);
    if (typeof outputResult.Value !== 'string') {
        let stripped = _stripKind(outputResult.Value);
        outputResult = Object.assign({}, outputResult, { Value: stripped });
    }
    return outputResult;
}
function _json(t) {
    switch (t.kind) {
        case 'Ref':
            return { Ref: t.Ref };
        case 'Condition':
            return _buildCondition(t);
        case 'Parameter':
            return _strip(t).Properties;
        case 'Output':
            return _buildOutput(t);
        case 'Resource':
            return _buildResource(t);
        default:
            console.log('You cant do that!');
            return 'Invalid!';
    }
}
exports._json = _json;
function _addDescription(t, e) {
    let result = Object.assign({}, t);
    let desc = { Description: e.Content };
    result = Object.assign({}, t, desc);
    return result;
}
function _addCondition(t, e) {
    // TODO: Validate intrinsics
    let result = Object.assign({}, t);
    result.Conditions[e.Name] = e;
    return result;
}
function _addOutput(t, e) {
    if (typeof e.Properties.Value !== 'string' && e.Properties.Value.Ref) {
        _validateRef(t, e.Properties.Value);
    }
    /*if (typeof e.Properties.Value !== 'string' && e.Properties.Value['Fn::GetAtt']) {
        _validateFnGetAtt(this, e.Properties.Value);
    }*/
    let result = Object.assign({}, t);
    result.Outputs[e.Name] = e;
    return result;
}
function _addParameter(t, e) {
    let result = Object.assign({}, t);
    result.Parameters[e.Name] = e;
    return result;
}
function _addResource(t, e) {
    let result = Object.assign({}, t);
    result.Resources[e.Name] = e;
    return result;
}
function _removeOutput(t, e) {
    let result = Object.assign({}, t);
    let out;
    if (typeof e === 'string') {
        if (result.Outputs[e]) {
            out = result.Outputs[e];
        }
        else {
            throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
        }
    }
    else {
        out = e;
    }
    if (result.Outputs[out.Name]) {
        delete result.Outputs[out.Name];
    }
    else {
        throw new SyntaxError(`Could not find ${JSON.stringify(out)}`);
    }
    return result;
}
function _removeParameter(t, e) {
    let result = Object.assign({}, t);
    let param;
    if (typeof e === 'string') {
        if (result.Parameters[e]) {
            param = result.Parameters[e];
        }
        else {
            throw new SyntaxError(`Could not find ${JSON.stringify(e)}`);
        }
    }
    else {
        param = e;
    }
    if (result.Parameters[param.Name]) {
        delete result.Parameters[param.Name];
    }
    else {
        throw new SyntaxError(`Could not find ${JSON.stringify(param)}`);
    }
    return result;
}
