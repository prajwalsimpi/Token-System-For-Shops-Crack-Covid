var express = require('express');
var vendorController = require('./controllers/vendorController')
var bookingsController = require('./controllers/bookingsController')
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
  


//template engine
app.set('view engine', 'ejs');

//fire controllers
vendorController(app, data);
console.log(data);

bookingsController(app,data);





app.listen(3000);
console.log('[Listening] at port 3000')
