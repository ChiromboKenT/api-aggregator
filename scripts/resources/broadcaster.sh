LOCALSTACK=http://localstack:4566
SERVICE_NAME="api_aggregator_broadcaster_local"

echo "Creating SNS queue ${SERVICE_NAME}"
aws --endpoint-url=${LOCALSTACK} sns create-topic --name ${SERVICE_NAME}

echo "Creating SQS queue ${SERVICE_NAME}"
aws --endpoint-url=${LOCALSTACK} sqs create-queue --queue-name ${SERVICE_NAME}

echo "Creating SQS subscription for SNS queue ${SERVICE_NAME}"
TOPIC_ARN=arn:aws:sns:eu-central-1:000000000000:${SERVICE_NAME}
QUEUE_ARN=arn:aws:sqs:eu-central-1:000000000000:${SERVICE_NAME}
SUBSCRIPTION_ARN=$(aws --endpoint-url=${LOCALSTACK} sns subscribe --topic-arn ${TOPIC_ARN} --protocol sqs --notification-endpoint ${QUEUE_ARN} --output text)
aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name RawMessageDelivery --attribute-value true
aws --endpoint-url=${LOCALSTACK} sns set-subscription-attributes --subscription-arn ${SUBSCRIPTION_ARN} --attribute-name FilterPolicy --attribute-value "{\"EVENT\":[\"API_AGGREGATED\"]}"
