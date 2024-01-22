#!/bin/sh

SNS_ENDPOINT="http://${LOCALSTACK}:4566"
SQS_ENDPOINT="http://${LOCALSTACK}:4566"

cat <<EOF >> /root/.aws/config
[default]
output = json
region = eu-central-1
EOF

cat <<EOF >> ~/.aws/credentials
[default]
aws_access_key_id = dummy-val
aws_secret_access_key = dummy-val
EOF

wait_for_localstack_services_to_be_ready_fn () {
  check_sqs_fn () {
    aws --endpoint-url "${SQS_ENDPOINT}" sqs list-queues > /dev/null 2>&1
    echo $?
  }

  check_sns_fn () {
    aws --endpoint-url="${SNS_ENDPOINT}" sns list-topics > /dev/null 2>&1
    echo $?
  }

  while [[ $(check_sqs_fn) -ne 0 ]]
  do
    echo "Waiting for localstack SQS service..."
    sleep 5
  done

  while [[ $(check_sns_fn) -ne 0 ]]
  do
    echo "Waiting for localstack SNS service..."
    sleep 5
  done
}

wait_for_localstack_services_to_be_ready_fn

echo "All needed localstack services are working"
TOPIC_NAME="api_event_bus_local"
echo "Creating SNS topic ${TOPIC_NAME}"
aws --endpoint-url=http://localstack:4566 sns create-topic --name ${TOPIC_NAME}

cd /resources || exit 1
for f in *.sh; do
  ./"$f" -H
done
