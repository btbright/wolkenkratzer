"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("../template");
const parameter_1 = require("../elements/parameter");
const intrinsic_1 = require("../intrinsic");
const service_1 = require("../service");
const cfn_doc_json_stubs_1 = require("cfn-doc-json-stubs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const fs = require('fs-extra');
const bluebird = require('bluebird');
const jszip = require('jszip');
const klaw = require('klaw');
const Lambda = service_1.Service(cfn_doc_json_stubs_1.Lambda);
const defaultConfig = {
    FunctionName: 'MyFunction',
    MemorySize: 128,
    Timeout: 30,
    Runtime: 'nodejs6.10',
    //env: {},
    Role: 'BlankRole',
    //kms: '',
    Handler: 'index.handler',
    Tags: [],
    Environment: {}
};
function _createInlineFunction({ path: inputPath, name, options, parameters }) {
    return new Promise((resolve, reject) => {
        fs
            .readFile(inputPath)
            .then(functionCode => {
            const props = {
                FunctionName: options.FunctionName,
                Handler: options.Handler,
                MemorySize: options.MemorySize,
                Role: parameters && parameters.includes('Role')
                    ? intrinsic_1.Ref(`${name}Role`)
                    : options.Role,
                Runtime: options.Runtime,
                Timeout: options.Timeout,
                Code: {
                    ZipFile: intrinsic_1.FnJoin('\n', functionCode.toString().split('\n'))
                }
                //Tags: options.Tags ? options.Tags.length > 0 : null
            };
            if (Object.keys(options.Environment).length > 0) {
                props.Environment = options.Environment;
            }
            if (options.Tags.length > 0) {
                props.Tags = options.Tags;
            }
            const fn = Lambda['Function'](name, props);
            resolve(fn);
        })
            .catch(e => {
            reject(e);
        });
    });
}
function _createInlineTemplate({ path: inputPath, name, options, parameters }) {
    return new Promise((resolve, reject) => {
        _createInlineFunction({ path: inputPath, name, options, parameters })
            .then(fnBlock => {
            let t = template_1.Template();
            if (parameters && parameters.length > 0) {
                parameters.map(p => {
                    t = t.add(parameter_1.Parameter(`${name}${p}`, { Type: 'String' }));
                });
            }
            t = t.add(fnBlock, {
                Output: true
            });
            resolve(t);
        })
            .catch(e => {
            reject(e);
        });
    });
}
/**
 * Create an inline Lambda function
 * @param {*} param0
 */
function buildInlineLambda({ path: inputPath, name, options, parameters }) {
    name = name ? name : defaultConfig.FunctionName;
    options = options ? lodash_1.merge({}, defaultConfig, options) : defaultConfig;
    inputPath = path_1.default.resolve(inputPath);
    return fs.stat(inputPath).then(stat => {
        if (stat.isFile()) {
            return _createInlineFunction({
                path: inputPath,
                name,
                options,
                parameters
            });
        }
        else {
            const indexPath = path_1.default.resolve(inputPath, 'index.js');
            return fs.stat(indexPath).then(statIndex => {
                if (statIndex.isFile()) {
                    return _createInlineFunction({
                        path: indexPath,
                        name,
                        options,
                        parameters
                    });
                }
                else
                    return null;
            });
        }
    });
}
exports.buildInlineLambda = buildInlineLambda;
/**
 * Create a Lambda function from a folder or source file
 * @param {} param0
 */
function buildLambda({ path: inputPath, name, options, parameters, output }) {
    name = name ? name : defaultConfig.FunctionName;
    options = options ? lodash_1.merge({}, defaultConfig, options) : defaultConfig;
    inputPath = path_1.default.resolve(inputPath);
    return new Promise((resolve, reject) => {
        fs
            .stat(inputPath)
            .then(stat => {
            if (stat.isFile()) {
                _createInlineFunction({
                    path: inputPath,
                    name: name,
                    options: options,
                    parameters: parameters
                })
                    .then(fn => {
                    resolve({ FunctionResource: fn });
                })
                    .catch(e => {
                    reject(e);
                });
            }
            else if (stat.isDirectory()) {
                const zip = new jszip();
                const files = [];
                klaw(inputPath)
                    .on('data', ({ path: location, stats }) => {
                    if (stats.isFile()) {
                        files.push(location);
                    }
                })
                    .on('end', function () {
                    if (files.length === 1 &&
                        path_1.default.relative(inputPath, files[0]) === 'index.js') {
                        _createInlineFunction({
                            path: files[0],
                            name: name,
                            options: options,
                            parameters: parameters
                        })
                            .then(fn => {
                            resolve({ FunctionResource: fn });
                        })
                            .catch(e => {
                            reject(e);
                        });
                    }
                    else {
                        bluebird
                            .map(files, file => {
                            return fs.readFile(file).then(contents => {
                                const relPath = path_1.default.relative(inputPath, file);
                                zip.file(relPath, contents);
                            });
                        })
                            .then(results => {
                            zip.generateAsync({ type: 'nodebuffer' }).then(blob => {
                                //fs.writeFileSync('final.zip', blob);
                                let t = template_1.Template()
                                    .add(parameter_1.Parameter(`${name}S3BucketParam`, { Type: 'String' }))
                                    .add(parameter_1.Parameter(`${name}S3KeyParam`, { Type: 'String' }));
                                if (parameters && parameters.length > 0) {
                                    parameters.map(p => {
                                        t = t.add(parameter_1.Parameter(`${name}${p}`, { Type: 'String' }));
                                    });
                                }
                                const fn = Lambda['Function'](name, {
                                    FunctionName: options.FunctionName,
                                    Handler: options.Handler,
                                    MemorySize: options.MemorySize,
                                    Role: parameters && parameters.includes('Role')
                                        ? intrinsic_1.Ref(`${name}Role`)
                                        : options.Role,
                                    Runtime: options.Runtime,
                                    Timeout: options.Timeout,
                                    Code: {
                                        S3Bucket: intrinsic_1.Ref('MyGreatFunctionS3BucketParam'),
                                        S3Key: intrinsic_1.Ref('MyGreatFunctionS3KeyParam')
                                    }
                                    //Tags: options.Tags ? options.Tags.length > 0 : null
                                });
                                resolve({
                                    FunctionResource: fn,
                                    Zip: blob
                                });
                            });
                        });
                    }
                });
            }
        })
            .catch(e => {
            reject(e);
        });
    });
}
exports.buildLambda = buildLambda;
/**
 * Create a Lambda function from a folder or source file
 * @param {} param0
 */
function buildLambdaTemplate({ path: inputPath, name, options, parameters, output }) {
    name = name ? name : defaultConfig.FunctionName;
    options = options ? lodash_1.merge({}, defaultConfig, options) : defaultConfig;
    inputPath = path_1.default.resolve(inputPath);
    return new Promise((resolve, reject) => {
        fs
            .stat(inputPath)
            .then(stat => {
            if (stat.isFile()) {
                _createInlineTemplate({
                    path: inputPath,
                    name: name,
                    options: options,
                    parameters: parameters
                })
                    .then(t => {
                    resolve({ Template: t.build() });
                })
                    .catch(e => {
                    reject(e);
                });
            }
            else if (stat.isDirectory()) {
                const zip = new jszip();
                const files = [];
                klaw(inputPath)
                    .on('data', ({ path: location, stats }) => {
                    if (stats.isFile()) {
                        files.push(location);
                    }
                })
                    .on('end', function () {
                    if (files.length === 1 &&
                        path_1.default.relative(inputPath, files[0]) === 'index.js') {
                        _createInlineTemplate({
                            path: files[0],
                            name: name,
                            options: options,
                            parameters: parameters
                        })
                            .then(t => {
                            resolve({ Template: t.build() });
                        })
                            .catch(e => {
                            reject(e);
                        });
                    }
                    else {
                        bluebird
                            .map(files, file => {
                            return fs.readFile(file).then(contents => {
                                const relPath = path_1.default.relative(inputPath, file);
                                zip.file(relPath, contents);
                            });
                        })
                            .then(results => {
                            zip.generateAsync({ type: 'nodebuffer' }).then(blob => {
                                //fs.writeFileSync('final.zip', blob);
                                let t = template_1.Template()
                                    .add(parameter_1.Parameter(`${name}S3BucketParam`, { Type: 'String' }))
                                    .add(parameter_1.Parameter(`${name}S3KeyParam`, { Type: 'String' }));
                                if (parameters && parameters.length > 0) {
                                    parameters.map(p => {
                                        t = t.add(parameter_1.Parameter(`${name}${p}`, { Type: 'String' }));
                                    });
                                }
                                t = t.add(Lambda['Function'](name, {
                                    FunctionName: options.FunctionName,
                                    Handler: options.Handler,
                                    MemorySize: options.MemorySize,
                                    Role: parameters && parameters.includes('Role')
                                        ? intrinsic_1.Ref(`${name}Role`)
                                        : options.Role,
                                    Runtime: options.Runtime,
                                    Timeout: options.Timeout,
                                    Code: {
                                        S3Bucket: intrinsic_1.Ref('MyGreatFunctionS3BucketParam'),
                                        S3Key: intrinsic_1.Ref('MyGreatFunctionS3KeyParam')
                                    }
                                    //Tags: options.Tags ? options.Tags.length > 0 : null
                                }), { Output: true });
                                resolve({
                                    Template: t.build(),
                                    Zip: blob
                                });
                            });
                        });
                    }
                });
            }
        })
            .catch(e => {
            reject(e);
        });
    });
}
exports.buildLambdaTemplate = buildLambdaTemplate;
//# sourceMappingURL=lambda.macro.js.map