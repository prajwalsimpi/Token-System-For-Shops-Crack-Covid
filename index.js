var express = require('express');
var vendorController = require('./controllers/vendorController')
var buyerController = require('./controllers/buyerController')
var bookingsController = require('./controllers/bookingsController')
var loginController = require('./controllers/loginConroller')
var MongoClient = require('mongodb').MongoClient
var url ="mongodb+srv://waleed:wal40250@cluster0-rlbi7.mongodb.net/test?retryWrites=true&w=majority"//'mongodb://localhost:27017/shoplist'
var app = express();

var data = [];
  
var selectedShop=0

//template engine
app.set('view engine', 'ejs');

//fire controllers
vendorController(app, data,MongoClient,url,selectedShop);

bookingsController(app,data,MongoClient,url);

buyerController(app,data,MongoClient,url)

loginController(app,data,MongoClient,url,selectedShop)

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});