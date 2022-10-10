from urllib import response
from flask import Flask, jsonify, request
from data import yelpAPI
from data.geocode import Geocode
import json
import os
# import flask_cors import CORS

app = Flask(__name__,
            static_url_path='', 
            static_folder='./static',)

gc = Geocode()
# CORS=(app)

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file("hellobusiness.html")

@app.route('/business', methods=['POST'])
def business():
    req = request.get_json()
    loc = req.pop('location')
    if loc != '':
        latitude, longitude = gc.searchOnAddress(loc)
    else:
        latitude, longitude = gc.searchOnIp(request.remote_addr)
    return yelpAPI.search(latitude = latitude, longitude=longitude, **req)

@app.route('/details/<id>',methods=['GET'])
def details(id):
    data= yelpAPI.get_business(id)
    response= jsonify(data)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8088)))