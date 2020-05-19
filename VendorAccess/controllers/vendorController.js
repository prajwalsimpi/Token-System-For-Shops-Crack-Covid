var bodyParser = require('body-parser');


var hour = [00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

var minu = [00,05,10,15,20,25,30,35,40,45,50,55] 

//var hrmn = {hr: hour, min:minu}

var urlencodeParser = bodyParser.urlencoded({extended:true});

module.exports = (app,data)=>{
    app.get('/vendor',(req, res)=>{
      res.render('vendor', {hour: hour, minu:minu} );

    });

    app.post('/vendor', urlencodeParser, (req, res)=>{
      
      var obtainedData = req.body;
      timeConv(obtainedData);
      console.log('inside vendor');
      console.log(data);
      res.render('vendor', {hour: hour, minu:minu} );     

    });

    var timeConv = (obtainedData)=>{
      var workingHrs;
      var ophr = Number(obtainedData['opening-hour']);
      var opmin = Number(obtainedData['opening-minu']);
      var optot = (ophr*60) + opmin;
      var clhr = Number(obtainedData['closing-hour']);
      var clmin = Number(obtainedData['closing-minu']);
      var diffhr = (clhr-ophr)*60;
      var diffmin = clmin-opmin;
      workingHrs = diffhr+diffmin;
      console.log(workingHrs);
      var sltdr = Number(obtainedData['slot-duration']);
      var totalSlots = Math.floor(workingHrs/Number(obtainedData['slot-duration']));
      var bps = obtainedData['bookings-per-slot'];
      console.log(totalSlots);
      var ttot = optot;
      while(totalSlots !=0){
        var arr = {};
        arr['start-slot'] = ttot;
        arr['end-slot'] = ttot + sltdr;
        arr['bookings-per-slot'] =bps;
        ttot = ttot + sltdr;
        data.push(arr);
        totalSlots --;
      }
       
      var lenData = data.length -1;
      console.log(lenData);
      while(lenData > -1){
        var times = data[lenData]['start-slot'];
        var timee = data[lenData]['end-slot'];
        var tsh = Math.floor(times/60);
        var tsm = times%60;
        var teh = Math.floor(timee/60);
        var tem = timee%60;
        data[lenData]['start-slot'] = `${tsh}:${tsm}`
        data[lenData]['end-slot'] = `${teh}:${tem}`

        lenData --;
      }

     console.log(data); 
    }
}
/* {
  'opening-hour': '4',
  'opening-minu': '15',
  'closing-hour': '9',
  'closing-minu': '50',
  'slot-duration': '10',
  'bookings-per-slot': '5'
} */