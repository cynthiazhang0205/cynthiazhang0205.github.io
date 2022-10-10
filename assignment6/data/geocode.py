import requests
import googlemaps
API_key = 'AIzaSyAHRw6dVzhl55boejbyPZmkiB0QdNqvj30'

class Geocode:
    def __init__(self):
        self.gmaps_key = googlemaps.Client(key=API_key)
    def searchOnAddress(self, address):
        g=self.gmaps_key.geocode(address)
        return g[0]['geometry']['location']['lat'],g[0]['geometry']['location']['lng']
    
    def searchOnIp(self, address):
        ret = requests.get(f'https://ipinfo.io/{address}?token=76d72ea168af96').json()
        return ret['loc'].split(',')
    
if __name__ == '__main__':
    gc=Geocode()
    print(gc.searchOnAddress('usc'))