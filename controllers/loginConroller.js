var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({extended:true});

var hour = [00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

var minu = [00,05,10,15,20,25,30,35,40,45,50,55] 

module.exports = (app, data,MongoClient,url,selectedShop) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.get("/select",(req,res)=>{
        res.render("selector")
    })

}