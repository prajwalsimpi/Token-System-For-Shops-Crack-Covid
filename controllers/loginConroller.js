var bodyParser = require('body-parser');

var urlencodeParser = bodyParser.urlencoded({extended:true});

module.exports = (app, data,MongoClient,url,selectedShop) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.get("/",(req,res)=>{
        res.redirect("/select")
    })
    app.get("/select",(req,res)=>{
        res.render("selector")
    })

}