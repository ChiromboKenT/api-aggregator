SERVICE_NAME="api_aggregator_core_local"
TOPIC_NAME="api_event_bus_local"
TABLE_NAME="AggregatorCoreTable"
LOCALSTACK=http://localstack:4566



echo "Creating SQS queue: ${SERVICE_NAME}"
aws --endpoint-url=${LOCALSTACK} sqs create-queue --queue-name ${SERVICE_NAME}

echo "Creating DynamoDB table: ${TABLE_NAME}"
SETTINGS=$(cat <<EOT
{
    "TableName": "${TABLE_NAME}",
    "KeySchema": [
      { "AttributeName": "PK", "KeyType": "HASH" },
      { "AttributeName": "SK", "KeyType": "RANGE" }
    ],
    "AttributeDefinitions": [
      { "AttributeName": "PK", "AttributeType": "S" },
      { "AttributeName": "SK", "AttributeType": "S" }
    ],
    "ProvisionedThroughput": {
      "ReadCapacityUnits": 5,
      "WriteCapacityUnits": 5
    }
}
EOT
)
aws --endpoint-url=${LOCALSTACK} dynamodb create-table --cli-input-json "${SETTINGS}"

echo "Creating SQS subscription for SNS topic: ${SERVICE_NAME}"
TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:${TOPIC_NAME}
QUEUE_ARN=arn:aws:sqs:us-east-1:000000000000:${SERVICE_NAME}
SUBSCRIPTION_ARN=$(aws --endpoint-url=${LOCALSTACK} sns subscribe --topic-arn ${TOPIC_ARN} --protocol sqs --notification-endpoint ${QUEUE_ARN} --output text)

aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name RawMessageDelivery --attribute-value true
aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name FilterPolicy --attribute-value "{\"EVENT\":[\"API_RESOLVED\"]}"
