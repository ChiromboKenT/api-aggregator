import { SQS } from 'aws-sdk';

export function mapSqsAttributes(attributes: SQS.MessageBodyAttributeMap) {
  if (!attributes || Object.keys(attributes).length === 0) return {};

  return Object.keys(attributes).reduce((result, key) => {
    result[key] = attributes[key].StringValue;
    return result;
  }, {});
}
