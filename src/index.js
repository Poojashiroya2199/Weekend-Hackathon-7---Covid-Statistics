// const express = require('express')
// const app = express()
// const bodyParser = require("body-parser");
// const port = 8080
// const data=require('./data');
// // Parse JSON bodies (as sent by API clients)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// const { connection } = require('./connector')
// // let maindata=JSON.parse(data);
// let recoveredans=0;
// let infectedans=0;
// let deathans=0;
// for(let i=0;i<data.length;i++){
// recoveredans+=data[i].recovered;
// infectedans+=data[i].infected;
// deathans+=data[i].death;
// }
// let activecase=infectedans-recoveredans;
// let hotspot=(activecase/infectedans).toFixed(5);
// let health=(deathans/infectedans).toFixed(5);
// app.get('/totalRecovered',(req,res)=>{   
// let obj={data:{_id: "total", recovered:135481}};
// res.send(obj);
// })
// app.get('/totalActive',(req,res)=>{
// let obj={data:{_id: "total", active:11574}};
// res.send(obj);
// })
// app.get('/totalDeath',(req,res)=>{
//     let obj={data:{_id: "total", death:11574}};
//     res.send(obj);
//     })
// app.get('/hotspotStates',(req,res)=>{
// let obj={data: [{state: "Maharastra", rate: 0.17854}, {state: "Punjab", rate: 0.15754}]};
// res.send(obj);
//     })
// app.get('/healthyStates',(req,res)=>{
// let obj={data: [{state: "Maharastra", mortality: 0.0004}, {state: "Punjab", mortality: 0.0007}]};
//         res.send(obj);
//             }) 
// app.listen(port, () => console.log(`App listening on port ${port}!`))
// module.exports = app;

const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')
const data=require('./data');

let ob = data;
let recoveredPatients = 0;
let totalActiveCases = 0;
let totalDeaths = 0;
let rateValue = [];
let mortalityValue = [];


for(let i=0 ; i<ob.data.length ; i++){
    
    recoveredPatients += ob.data[i].recovered;
    totalActiveCases += (ob.data[i].infected - ob.data[i].recovered);
    totalDeaths += ob.data[i].death;
    rateValue[i] = parseFloat(((ob.data[i].infected - ob.data[i].recovered) / ob.data[i].infected).toFixed(5));
    mortalityValue[i] = parseFloat((ob.data[i].death/ob.data[i].infected).toFixed(5));
}


app.get('/totalRecovered',(req,res)=>{   
    let obj={data:{_id: "total", recovered: recoveredPatients}};
    res.send(obj);
})

app.get('/totalActive' , (req,res) => {
    let obj = {data: {_id: "total", active:totalActiveCases}};
    res.send(obj);
})


app.get('/totalDeath' , (req,res) => {
    let obj = {data: {_id:"total", death:totalDeaths}};
    res.send(obj);
})


let hotspotStatesArr = []
for(let i = 0 ; i<ob.data.length ; i++){
    if(rateValue[i] > 0.1){
        let newObj = {
            state : ob.data[i].state,
            rate: rateValue[i]
        }
        hotspotStatesArr.push(newObj);
    }
}

app.get('/hotspotStates' , (req,res) => {
    let obj = {data: hotspotStatesArr}
    res.send(obj);
})


let healthyStatesArr = []
for(let i = 0 ; i<ob.data.length ; i++){
    if(mortalityValue[i] < 0.005){
        let newObj = {
            state : ob.data[i].state,
            mortality : mortalityValue[i]
        }
        healthyStatesArr.push(newObj);
    }
}

app.get('/healthyStates' , (req,res) => {
    let obj = {data: healthyStatesArr}
    res.send(obj);
})





app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
