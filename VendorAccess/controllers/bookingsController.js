var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended:true});
module.exports = (app, data)=>{
    app.get('/bookings', (req, res)=>{
        res.render('bookings',{data: data});
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
            
            /* for (var j; j <= dltSlot.length; j++){
                console.log(j);
                var singleItemPop = Number(dltSlot[j]);
                console.log(singleItemPop);
                data.splice(singleItemPop,1);
            } */
        }
        res.render('bookings',{data: data});
    });
}