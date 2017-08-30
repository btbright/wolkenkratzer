export interface IParameterProperties {
  readonly Type: string;
  readonly AllowedPattern?: string;
  readonly AllowedValues?: string;
  readonly ConstraintDescription?: string;
  readonly Default?: string;
  readonly Description?: string;
  readonly MaxLength?: string;
  readonly MaxValue?: string;
  readonly MinLength?: string;
  readonly MinValue?: string;
  readonly NoEcho?: string;
}

export interface IParameter {
  readonly kind: 'Parameter';
  readonly Name: string;
  readonly Properties: IParameterProperties;
}

/**
 * Create a Parameter object
 * @param {*} name 
 * @param {*} properties 
 */
export function Parameter(
  name: string,
  properties: IParameterProperties
): IParameter {
  if (!name || !properties || !properties.Type) {
    throw new SyntaxError(
      `New Parameter with ${JSON.stringify({
        name,
        properties
      })} parameters is invalid. Name and Type are required.`
    );
  }

  return { kind: 'Parameter', Name: name, Properties: properties };
}