from requests import get as GET
from requests import put as PUT
from requests import post as POST
from json import dumps as json

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


res = PUT(url + "block", data = json(block1))
id1 = res.json()['id']

res = PUT(url + "block", data = json(block2))
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

res = PUT(url + "block", data = json(block3))
id3 = res.json()['id']

res = PUT(url + "block", data = json(block4))
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

res = PUT(url + "project", data = json(proj1))
pid1 = res.json()['id']


res = GET(url + "project", params = {"id":pid1})

res = POST(url + "clone", params = {"id":pid1})
pid2 = res.json()['id']

res = POST(url + "clone", params = {"id":pid2})
pid3 = res.json()['id']

res = POST(url + "clone", params = {"id":pid3})
pid4 = res.json()['id']

res = GET(url + "project", params = {"id":pid4})

hist = GET(url + "history", params = {"id":pid4})

child = GET(url + "children", params = {"id":pid1})