import { IParameter } from './elements/parameter';
import { IDescription } from './elements/description';
//import { IMetadata } from './elements/metadata';
//import { IMapping } from './elements/mapping';
//import { ICondition } from './elements/condition';
//import { IResource } from './elements/resource';
//import { IOutput } from './elements/output';

export interface ITemplate {
    readonly kind: 'template';
    readonly Description?: string;
    readonly Parameters: Array<IParameter>;
    //readonly Metadata: Array<IMetadata>;
    //readonly Mappings: Array<IMapping>;
    //readonly Conditions: Array<ICondition>;
    //readonly Resources: Array<IResource>;
    //readonly Output: Array<IOutput>;
}

export function Template(): ITemplate {
    return {
        Parameters: [],
        kind: 'template'
    };
}
