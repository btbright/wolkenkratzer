import { ITemplate } from './template';
import { ICondition } from './elements/condition';
import { IParameter } from './elements/parameter';
import { IResource } from './elements/resource';
import { IOutput } from './elements/output';
import { IDescription } from './elements/description';
export declare function addCondition(t: ITemplate, e: ICondition): ITemplate;
export declare function addParameter(t: ITemplate, e: IParameter): ITemplate;
export declare function addOutput(t: ITemplate, e: IOutput): ITemplate;
export declare function addResource(t: ITemplate, e: IResource): ITemplate;
export declare function addDescription(t: ITemplate, e: IDescription): ITemplate;
export declare function removeParameter(t: ITemplate, e: IParameter | string): ITemplate;
export declare function removeOutput(t: ITemplate, e: IOutput | string): ITemplate;
export declare function removeDescription(t: ITemplate): ITemplate;
export declare function build(t: ITemplate): object;
