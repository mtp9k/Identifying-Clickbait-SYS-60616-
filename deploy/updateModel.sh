MODEL_DIR="gs://dl-project-model/bert"
VERSION_NAME = 'v2'
MODEL_NAME="dlmodel"
FRAMEWORK="tensorflow"

gcloud ai-platform versions create $VERSION_NAME \
  --model=$MODEL_NAME \
  --origin=$MODEL_DIR \
  --runtime-version=2.4 \
  --framework=$FRAMEWORK \
  --python-version=3.7 \
  --region='us-central1' \
  --machine-type='n1-standard-2'