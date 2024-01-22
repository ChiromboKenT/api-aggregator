SERVICE_NAME="api_aggregator_core_local"
TABLE_NAME="AggregatorCoreTable"
LOCALSTACK=http://localstack:4566

echo "Creating SQS queue ${SERVICE_NAME}"
aws --endpoint-url=${LOCALSTACK} sqs create-queue --queue-name ${SERVICE_NAME}

echo "Creating dynamodb ${SERVICE_NAME}"
SETTINGS=$(cat << EOT
{
    "TableName": "${TABLE_NAME}",
    "KeySchema": [
      { "AttributeName": "urn", "KeyType": "HASH" }
    ],
    "AttributeDefinitions": [
      { "AttributeName": "urn", "AttributeType": "S" }
    ],
    "ProvisionedThroughput": {
      "ReadCapacityUnits": 5,
      "WriteCapacityUnits": 5
    }
}
EOT
)

aws --endpoint-url=${LOCALSTACK} dynamodb create-table --cli-input-json "${SETTINGS}"

echo "Creating SQS subscription for SNS queue ${SERVICE_NAME}"
TOPIC_ARN=arn:aws:sns:eu-central-1:000000000000:${SERVICE_NAME}
QUEUE_ARN=arn:aws:sqs:eu-central-1:000000000000:${SERVICE_NAME}
SUBSCRIPTION_ARN=$(aws --endpoint-url=${LOCALSTACK} sns subscribe --topic-arn ${TOPIC_ARN} --protocol sqs --notification-endpoint ${QUEUE_ARN} --output text)
aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name RawMessageDelivery --attribute-value true
aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name FilterPolicy --attribute-value "{\"EVENT\":[\"API_RESOLVED\"]}"
