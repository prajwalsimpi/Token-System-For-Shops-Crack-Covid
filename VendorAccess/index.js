var express = require('express');
var vendorController = require('./controllers/vendorController')
var buyerController = require('./controllers/buyerController')
var bookingsController = require('./controllers/bookingsController')
var loginController = require('./controllers/loginConroller')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/shoplist'
var app = express();

/* var data = [{
    'opening-hour': '4',
    'opening-minu': '15',
    'closing-hour': '9',
    'closing-minu': '50',
    'slot-duration': '10',
    'bookings-per-slot': '5'
  },
  {
    'opening-hour': '4',
    'opening-minu': '15',
    'closing-hour': '9',
    'closing-minu': '50',
    'slot-duration': '10',
    'bookings-per-slot': '5'
  } ]; */

var data = [];
  
var selectedShop=0

//template engine
app.set('view engine', 'ejs');

//fire controllers
vendorController(app, data,MongoClient,url,selectedShop);

bookingsController(app,data,MongoClient,url);

buyerController(app,data,MongoClient,url)

loginController(app,data,MongoClient,url,selectedShop)

app.listen(3000);
console.log('[Listening] at port 3000')
