import json
import sys
import requests
import argparse
import json
import urllib
import pprint

from .geocode import API_key

try:
    from urllib.error import HTTPError
    from urllib.parse import urlencode
    from urllib.parse import quote
except ImportError:
    from urllib3 import HTTPError
    from urllib import urlencode
    from urllib import quote
    
API_KEY = 'Uk63JFnChTAilJ9nUDcGrZMiPR9GLFk3OSrc1vp44JIIZLuoIUA2M8hrd_-SHyKXor67bB_KlCi2DvYk2foMkEXN0GEb2GCmx9Bmx6-2UT-8I9kBGHrEZQkrw2U_Y3Yx'
API_HOST ='https://api.yelp.com/'
SEARCH_PATH = 'v3/businesses/search'
BUSINESS_PATH = 'v3/businesses/'
SEARCH_LIMIT = 20

def request(host, path, url_params={}):
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = { 'Authorization' : f'Bearer {API_KEY}' }
    response = requests.request('get', url , headers=headers, params=url_params) 
    return response.json()

def search(term, latitude, longitude, categories, radius):
    url_params = {
        'term': term,
        'latitude': latitude,
        'longitude': longitude,
        'categories': categories,
        'radius': int(int(radius) * 1609.344),
        'limit': SEARCH_LIMIT
    }
    return request(API_HOST, SEARCH_PATH, url_params=url_params)


def get_business(business_id):
    business_path = BUSINESS_PATH + business_id
    return request(API_HOST, business_path)


def query_api(term, latitude, longitude, categories, radius):
    response = search(term, latitude, longitude, categories, radius)

    businesses = response.get('businesses')
    if not businesses:
        return None

    business_id = businesses[0]['id']

    response = get_business(business_id)

    return response





