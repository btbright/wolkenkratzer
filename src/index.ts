export { Template } from './template';
export { Parameter } from './elements/parameter';
export { Description } from './elements/description';
export { Output } from './elements/output';
export { Condition } from './elements/condition';
export { addParameter, addCondition, addOutput, addResource, addDescription, removeOutput, removeDescription, removeParameter, build } from './actions';
export { Ref, FnEquals } from './intrinsic';
import { Service, IService } from './service';

import * as fs from 'fs';
import * as path from 'path';

const files = fs.readdirSync(path.resolve(__dirname, '../stubs/json/resources/'));

files.map(file => {
    const service = file.replace('.json', '');
    exports[service] = Service(service);
});
