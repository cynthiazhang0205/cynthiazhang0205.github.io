const express = require('express')
const process = require('process')
const fetch = require('node-fetch')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const API_KEY = 'Uk63JFnChTAilJ9nUDcGrZMiPR9GLFk3OSrc1vp44JIIZLuoIUA2M8hrd_-SHyKXor67bB_KlCi2DvYk2foMkEXN0GEb2GCmx9Bmx6-2UT-8I9kBGHrEZQkrw2U_Y3Yx'
const API_HOST = 'https://api.yelp.com';
const AUTOCOMPLETE_ROUTE = 'v3/autocomplete';
const SEARCH_ROUTE = 'v3/businesses/search';
const BUSINESS_ROUTE = 'v3/businesses';

let DEBUG = false;


const headers = {
    'Authorization': `Bearer ${API_KEY}`,
};

const get_loc = async (address) => {
    return new Promise((resolve, reject) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?' + new URLSearchParams({
            address, key: 'AIzaSyAHRw6dVzhl55boejbyPZmkiB0QdNqvj30'
        })).then((response) => {
            return response.json();
        }).then((data) => {
            resolve(data.results[0].geometry.location);
        })
    })
}

app.set('trust proxy', true);
app.use(express.json());
app.use(cors());

app.get('/autocomplete', (req, res) => {
    fetch(
        `${API_HOST}/${AUTOCOMPLETE_ROUTE}?` + new URLSearchParams(req.query), {headers})
        .then(async (response) => {
            let list = await response.json();
            let ret = [];
            list.terms.forEach((term) => {
                ret.push(term.text);
            })
            list.categories.forEach((term) => {
                ret.push(term.title);
            });
            res.send(ret);
        })
})

app.get('/business', async (req, res) => {
    let query = req.query;
    if (query.location == '') {
        try{
            let ip = DEBUG? '45.23.124.237' : req.ip;
            let location = await fetch(`https://ipinfo.io/${ip}?token=76d72ea168af96`);
            let _, [latitude, longitude] = (await location.json()).loc.split(',');
            query.latitude = latitude;
            query.longitude = longitude;
        } catch (e) {
            query.latitude = 34.0522342;
            query.longitude = -118.2436849;
        }
    } else {
        let loc = await get_loc(query.location);
        console.log(loc);
        query.latitude = loc.lat;
        query.longitude = loc.lng;
    }
    delete query.location;
    query.limit = 10;
    query.radius = Math.floor(query.radius * 1609.344);
    fetch(`${API_HOST}/${SEARCH_ROUTE}?` + new URLSearchParams(query), {headers}).then(async response => {
        res.send(await response.json())
    })
})

app.get('/details/:id', async (req, res) => {
    let response = await fetch(`${API_HOST}/${BUSINESS_ROUTE}/${req.params.id}`, {headers});
    res.send(await response.json());
})

app.get('/reviews/:id', async (req, res) => {
    let response = await fetch(`${API_HOST}/${BUSINESS_ROUTE}/${req.params.id}/reviews`, {headers});
    res.send(await response.json());
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static(__dirname + '/static'));

app.use(function(req,res){
    res.status(404).redirect('/');
})
// if(e.target.checked) {
//     $.get('https://ipinfo.io/json?token=76d72ea168af96', function(data) {
//     console.log('Response', data["loc"]);
//     loc = data["loc"];
//     location.value = ""
// });

// API_key = 'AIzaSyAHRw6dVzhl55boejbyPZmkiB0QdNqvj30'
