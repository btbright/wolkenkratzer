"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ec2info = require('../ec2info/www/instances.json');
const results = ec2info.map(i => {
    return {
        instance_type: i.instance_type,
        linux_virtualization_types: i.linux_virtualization_types,
        arch: i.arch
    };
});
fs_extra_1.default
    .writeJson(path_1.default.resolve(__dirname, '..', 'ec2info.json'), results)
    .then(() => { })
    .catch(console.error);
//# sourceMappingURL=buildEC2Data.js.map