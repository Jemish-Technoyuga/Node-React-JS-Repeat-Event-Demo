const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
const Cors = require("cors");
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(Express.json());
app.use(Cors());

Mongoose.connect("mongodb://127.0.0.1:27017/Technoyuga");

const schema = new Mongoose.Schema({
    event:String,
    repeatType: String,
    fromDate: String,
    toDate: String,
    startTime : String,
    endTime : String,
});

const EventModel = Mongoose.model("event",schema);

const eventDataSchema = new Mongoose.Schema({
    eventId : String,
    customers:Number,
    likes:Number,
    donations:Number,
});

const EventDataModel = Mongoose.model("event_static",eventDataSchema);

app.get('/getAllEvents', async(req,res)=>{
    var events =await EventModel.find();
    res.status(200).send(events);
});

app.get('/getEventListings', async(req,res)=>{
    let eventList =[];
    let presentEvents =[];
    let upcomingEvents =[];
    let previousEvents = [];
    var eventsData = await EventDataModel.find();

    let presentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));

    let eventObj =(el,date)=>{
        let eventId = el._id+'-'+Date.parse(date);
        let obj = eventsData.find(el2 => el2.eventId===eventId);
      
            return {
              eventId:eventId,
              event : el.event,
              date : date.toISOString(),
              startTime : el.startTime,
              endTime : el.endTime,
              customers: obj ? obj.customers : 0,
              likes: obj ? obj.likes : 0,
              donations: obj ? obj.donations: 0,
            }
        }

    var events = await EventModel.find();

    events.forEach(el=>{
        let fromDate = new Date(el.fromDate);
        let toDate = new Date(el.toDate);
        if(el.repeatType==='daily'){
            for(let d = fromDate; d <= toDate; d.setDate(d.getDate()+1)){
                eventList.push(eventObj(el,d));
            }
        }
        else if(el.repeatType==='weekly'){
            for(let d = fromDate; d <= toDate; d.setDate(d.getDate()+7)){
                eventList.push(eventObj(el,d));
            }
        }
        else if(el.repeatType==='monthly'){
            let d = fromDate;

            while(d <= toDate){
                eventList.push(eventObj(el,d));
                var lastDay = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                if(lastDay.getDate()< d.getDate()){
                    d.setMonth(d.getMonth()+2);
                }
                else{
                    d.setMonth(d.getMonth()+1);
                }
            }
        }
    });

    eventList.forEach((el)=>{
        let eventDate = new Date(el.date);
        if(presentDate.getTime() === eventDate.getTime()){
        presentEvents.push(el);
        }
        else if(eventDate < presentDate){
            previousEvents.push(el);
        }
        else if(eventDate > presentDate){
            upcomingEvents.push(el);
        }
    });

    res.status(200).send({
        eventList : eventList.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        }),
        presentEvents : presentEvents.sort(function (a, b) {
            if(a.startTime>b.startTime) return 1;
            else if(a.startTime<b.startTime) return -1;
            return 0;
        }),
        upcomingEvents: upcomingEvents.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        }),
        previousEvents: previousEvents.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        }),
    });
});


app.post('/registerEvent',async (req,res)=>{
   let event = req.body.event;
   let repeatType =  req.body.repeatType;
   let fromDate = req.body.fromDate;
   let toDate = req.body.toDate;
   let startTime = req.body.startTime;
   let endTime = req.body.endTime;

   let eventObj ={
    event: event,
    repeatType: repeatType,
    fromDate: fromDate,
    toDate: toDate,
    startTime: startTime,
    endTime: endTime,
   }

   var e = new EventModel(eventObj);
   var result = await e.save();
   res.status(200).send(result);

});

app.post('/addEventData', async (req, res) => {
    let eventId = req.body.eventId;
    var eventData = await EventDataModel.findOne({ eventId: eventId});

    if(!eventData){
        eventData = await EventDataModel.create({
            eventId:eventId,
            customers:0,
            likes:0,
            donations:0,
        });
    }
    
    eventData.customers = req.body.customers ? Math.sign(req.body.customers)===1 ? ++eventData.customers : --eventData.customers : eventData.customers;
    eventData.likes = req.body.likes ? Math.sign(req.body.likes)===1 ? ++eventData.likes: --eventData.likes: eventData.likes;
    eventData.donations = req.body.donations ? +eventData.donations+ +req.body.donations : eventData.donations;
   
    let result = await eventData.save();

    res.status(200).send(result);

});



var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})


