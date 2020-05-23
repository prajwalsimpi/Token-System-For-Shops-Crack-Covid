
var bodyParser = require('body-parser');

var shops = [
    {
        id: 1,
        name: "Shop Name 1",
        addr: "Address1",
        open: 120,
        close: 1240,
        intervalMin: 35
    },
    {
        id: 2,
        name: "Shop Name 2",
        addr: "Address2",
        open: 1520,
        close: 1940,
        intervalMin: 45
    },
    {
        id: 3,
        name: "Shop Name 3",
        addr: "Address3",
        open: 1120,
        close: 1740,
        intervalMin: 5
    },
    {
        id: 4,
        name: "Shop Name 4",
        addr: "Address4",
        open: 1020,
        close: 1440,
        intervalMin: 30
    }
]


module.exports = (app, data,MongoClient,url) => {
    

    app.use(bodyParser.urlencoded({ extended: false }));

    app.get("/buyer/register",(req,res)=>{
        res.render("b_register")
    })
    app.post("/buyer/register",(req,res)=>{
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('users')
            col.insertOne(req.body)
          })
    })
    app.post("/buyer/login",(req,res)=>{
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('users')
        
            col.findOne({uname:req.body.uname},(err,item)=>{
                if(item!=null){
                    if (item.input_password == req.body.password){
                        isLogin = true
                        
                        selectedUser = item
                        res.redirect('/shoplist')
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
    app.get("/buyer/login",(req,res)=>{
        res.render("b_login")
    })

    app.get("/shoplist", (request, response) => {
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('shops')
            col.find().toArray().then(item=>{
                //console.log(item)
                if(item!=undefined){
                    data = item
                    //console.log(data)
                    response.render('shoplist.ejs',{shops: data});
                }else{
                    console.log("bruh")
                    response.render("shoplist.ejs", { shops: [] });
                }
                
            })
            
          })
        
    });
selectedShop = 0
    // send the default array of dreams to the webpage
    app.get("/shop", (request, response) => {
        //console.log(request.query._id)
        // express helps us take JS objects and send them as JSON
        selectedShop = request.query.sname
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('shops')

            col.find({sname:request.query.sname}).toArray().then(item=>{
                console.log(item)
                if(item!=undefined){
                    data = item
                    console.log(data)
                    response.render("shoppage.ejs", { shop: data[0] });
                }else{
                    response.render("shoppage.ejs", { shop: [] });
                }
                
            })
            
          })

        
    });

    app.post("/shop", (req, res) => {
        console.log(req.body)
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('reserve')
            col.insertOne({sname:selectedShop,uname:selectedUser.uname,time:req.body.hours})
            
        })
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('shops')
            col.findOne({sname:selectedShop},(err,item)=>{
                
                item.slots.forEach(element => {
                    if(element["start-slot"]==req.body.hours){
                        if(element["curr_count"]<Number(element['bookings-per-slot'])){
                        res.redirect("/shoplist")
                            element["curr_count"]+=1
                        }else
                            res.send("Slots filled")
                    }
                });
                col.replaceOne({sname:selectedShop},item)
            })
            
        })
        
        
        
    })


    reserves = []
    app.get("/reserve",(req,res)=>{
        MongoClient.connect(url,(err,client)=>{
            var db = client.db('shoplist')
            var col = db.collection('reserve')
            console.log(selectedUser.uname)
            col.find({uname:selectedUser.uname}).toArray().then(item=>{
                reserves.push(item)
                console.log(item)
            res.render("reservations",{shops:item})

            })
            
            
        })
        
    })
    // listen for requests :

}
