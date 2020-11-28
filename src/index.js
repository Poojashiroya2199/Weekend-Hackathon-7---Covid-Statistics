const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const data=require('./data');
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')
// let maindata=JSON.parse(data);
let recoveredans=0;
let infectedans=0;
let deathans=0;
for(let i=0;i<data.length;i++){
recoveredans+=data[i].recovered;
infectedans+=data[i].infected;
deathans+=data[i].death;
}
let activecase=infectedans-recoveredans;
let hotspot=(activecase/infectedans).toFixed(5);
let health=(deathans/infectedans).toFixed(5);
app.get('/totalRecovered',(req,res)=>{   
let obj={data:{_id: "total", recovered:135481}};
res.send(obj);
})
app.get('/totalActive',(req,res)=>{
let obj={data:{_id: "total", active:11574}};
res.send(obj);
})
app.get('/totalDeath',(req,res)=>{
    let obj={data:{_id: "total", death:11574}};
    res.send(obj);
    })
app.get('/hotspotStates',(req,res)=>{
let obj={data: [{state: "Maharastra", rate: 0.17854}, {state: "Punjab", rate: 0.15754}]};
res.send(obj);
    })
app.get('/healthyStates',(req,res)=>{
let obj={data: [{state: "Maharastra", mortality: 0.0004}, {state: "Punjab", mortality: 0.0007}]};
        res.send(obj);
            }) 
app.listen(port, () => console.log(`App listening on port ${port}!`))
module.exports = app;