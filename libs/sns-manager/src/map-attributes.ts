import { MessageAttributeMap } from 'aws-sdk/clients/sns';

export type Attributes = Record<string, string | number | boolean>;

export function mapAttributes(attributes?: Attributes): MessageAttributeMap {
  if (!attributes || Object.keys(attributes).length === 0) return {};

  const result = {};
  for (const key of Object.keys(attributes)) {
    result[key] = {
      DataType: 'String',
      StringValue:
        attributes[key] != undefined ? attributes[key].toString() : '',
    };
  }

  return result;
}
