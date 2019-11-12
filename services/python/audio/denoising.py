import requests
import base64
from pydub import AudioSegment

def denoiseAudio(audio):
    url = "https://proxy.api.deepaffects.com/audio/generic/api/v2/async/denoise"
    querystring = {"apikey":"w2kCXFyGpxitDQC3v48sr5E33skriti9", "webhook":"https://webhook.site/2672a949-c7e9-4142-9a63-cedd23f73d38"}
    payload = {
        "encoding": "Wave",
        "languageCode": "en-US",
        "sampleRate": 8000
    }
    # The api accepts data either as a url or as base64 encoded content
    # passing payload as url:
    payload["url"] = audio
    # alternatively, passing payload as content:
    with open(audio, 'rb') as fin:
        audio_content = fin.read()
    payload["content"] = base64.b64encode(audio_content).decode('utf-8')

    headers = {
        'Content-Type': "application/json",
    }

    response = requests.post(url, json=payload, headers=headers, params=querystring)
    print(response.text)
