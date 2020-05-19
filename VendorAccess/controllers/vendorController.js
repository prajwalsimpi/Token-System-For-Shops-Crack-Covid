var bodyParser = require('body-parser');

var hour = [00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

var minu = [00,05,10,15,20,25,30,35,40,45,50,55] 

//var hrmn = {hr: hour, min:minu}

var urlencodeParser = bodyParser.urlencoded({extended:true});

module.exports = (app,data,MongoClient,url,selectedShop)=>{
    app.get('/vendor',(req, res)=>{
      console.log(selectedShop)
      res.render('vendor', {hour: hour, minu:minu,shop:selectedShop} );

    });

    app.get("/vendor/login",(req,res)=>{
      res.render("v-login")
  })
  app.get("/vendor/register",(req,res)=>{
      res.render("vendor_reg")
  })
  app.use(bodyParser.urlencoded({ extended: false }));
  app.post("/vendor/login",(req,res)=>{

      console.log(req.body)
      MongoClient.connect(url,(err,client)=>{
          var db = client.db('shoplist')
          var col = db.collection('shops')
      
          col.findOne({sname:req.body.sname},(err,item)=>{
              if(item!=null){
                  if (item.input_password == req.body.password){
                      isLogin = true
                      
                      selectedShop = item
                      res.redirect('/vendor')
                  }
                  else{
                      isLogin = false
                      res.send("Login Failed")
                  }
              }
              else{
                  res.send("Login Failed")
              } 
          })
        })
  })
  app.post("/vendor/register",urlencodeParser,(req,res)=>{
      console.log(req.body)
      MongoClient.connect(url,(err,client)=>{
          var db = client.db('shoplist')
          var col = db.collection('shops')
          col.insertOne(req.body)
        })

      res.redirect("/vendor/login",)
  })

  app.get('/bookings', (req, res)=>{
    res.render('bookings',{data: selectedShop.slots});
      
      console.log("in booking")
      console.log(data)
    
});

app.post('/bookings',urlencodeParser, (req,res)=>{
    console.log(req.body.deleteSlots);
    var dltSlot = req.body.deleteSlots
    console.log(typeof(dltSlot))
    if (typeof(dltSlot)==="string"){
        console.log(111110);
        dltSlot = Number(dltSlot);
        data.splice(dltSlot,1);
    }
    else if(typeof(dltSlot) ==="object"){
        console.log(111)
        var dLen = dltSlot.lenght - 1;
        while(dLen > -1){
            console.log(dltSlot[dLen]);
            var singleItemPop = Number(dltSlot[dLen]);
            console.log(singleItemProp);
            data.splice(singleItemPop,1); 
            dLen --;
        } 
   
    }
    MongoClient.connect(url,(err,client)=>{
      var db = client.db('shoplist')
      var col = db.collection('shops')
      col.updateOne({sname:selectedShop.sname},{$set:{"slots":data}},{upsert:true})
    })
    res.render('bookings',{data: data});
});
    
    app.post('/vendor',urlencodeParser, (req, res)=>{
      data = []
      var obtainedData = req.body
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
        arr['curr_count']=0
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
      console.log('inside vendor');
      console.log(data)
      selectedShop.slots = data
      MongoClient.connect(url,(err,client)=>{
        var db = client.db('shoplist')
        var col = db.collection('shops')
        col.updateOne({sname:selectedShop.sname},{$set:{"slots":data}},{upsert:true})
      })
      
      res.redirect("/vendor");     
      
    });

    var timeConv = (req,res,next)=>{
      var obtainedData = req.body
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
      data = []
      while(totalSlots !=0){
        var arr = {};
        arr['start-slot'] = ttot;
        arr['end-slot'] = ttot + sltdr;
        arr['bookings-per-slot'] =bps;
        arr["curr_count"]=0
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