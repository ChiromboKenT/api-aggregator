SERVICE_NAME="api_aggregator_request_handler_local"

echo "Creating SQS queue ${SERVICE_NAME}"
aws --endpoint-url=http://localstack:4566 sqs create-queue --queue-name ${SERVICE_NAME}