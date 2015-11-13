import requests
import json
from uuid import uuid4

url = "http://localhost:3000/api/"

block1 = {
  "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  }
}

block2 = {
  "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  }
}


res = requests.put(url + "block", data = json.dumps(block1))
id1 = res.json()['id']

res = requests.put(url + "block", data = json.dumps(block2))
id2 = res.json()['id']

block3 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "components": [
    id1,
    id2
  ]
}

block4 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "options": [
    id1,
    id2
  ]
}

res = requests.put(url + "block", data = json.dumps(block3))
id3 = res.json()['id']

res = requests.put(url + "block", data = json.dumps(block4))
id4 = res.json()['id']

proj1 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "components": [
    id3,
    id4
  ]
}

res = requests.put(url + "project", data = json.dumps(proj1))
pid = res.json()['id']


res = requests.get(url + "project", params = {"id":pid})