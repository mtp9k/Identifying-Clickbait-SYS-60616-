from chalice import Chalice
import os
import json
import googleapiclient.discovery
from google.api_core.client_options import ClientOptions

def predict_json(project, region, model, instances, version=None):
    """Send json data to a deployed model for prediction.

    Args:
        project (str): project where the Cloud ML Engine Model is deployed.
        region (str): regional endpoint to use; set to None for ml.googleapis.com
        model (str): model name.
        instances ([Mapping[str: Any]]): Keys should be the names of Tensors
            your deployed model expects as inputs. Values should be datatypes
            convertible to Tensors, or (potentially nested) lists of datatypes
            convertible to tensors.
        version: str, version of the model to target.
    Returns:
        Mapping[str: any]: dictionary of prediction results defined by the
            model.
    """
    # Create the ML Engine service object.
    # To authenticate set the environment variable
    #GOOGLE_APPLICATION_CREDENTIALS='/content/drive/MyDrive/deeplearning-311117-9649231a1c22.json'
    prefix = "{}-ml".format(region) if region else "ml"
    api_endpoint = "https://{}.googleapis.com".format(prefix)
    client_options = ClientOptions(api_endpoint=api_endpoint)
    service = googleapiclient.discovery.build(
        'ml', 'v1', client_options=client_options)
    name = 'projects/{}/models/{}'.format(project, model)

    if version is not None:
        name += '/versions/{}'.format(version)

    response = service.projects().predict(
        name=name,
        body={'instances': instances}
    ).execute()

    if 'error' in response:
        raise RuntimeError(response['error'])

    return response['predictions']

app = Chalice(app_name='deeplearning')

@app.route('/query',cors=True)
def index():
    filename = os.path.join(
    os.path.dirname(__file__), 'chalicelib', 'credentials.json')
    request = app.current_request.to_dict()
    query_params = request["query_params"]
    instances = query_params['instances']
    instances = instances.split(',')
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=filename
    result = predict_json('deeplearning-311117','us-central1','dlmodel',instances)
    result = [res[0] for res in result]
    return {'response': result}

filename = os.path.join(
os.path.dirname(__file__), 'chalicelib', 'credentials.json')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=filename
result = predict_json('deeplearning-311117','us-central1','dlmodel',['hellothere'])
print(result)

