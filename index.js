const http = require("http");
const fs = require("fs");
const requests = require("requests");
const { text } = require("express");
const { url } = require("inspector");
const homeFile = fs.readFileSync("home.html", "utf-8");
const port = process.env.PORT || 3000;

const replaceVal=(tempVal,orgVal)=>{
var temperature =  tempVal.replace("{%tempval%}", orgVal.current.temp_c);
 temperature = temperature.replace("{%feel%}", orgVal.current.feelslike_c);
 temperature = temperature.replace("{%text%}", orgVal.current.condition.text);
 temperature = temperature.replace("{%city%}", orgVal.location.name);
 temperature = temperature.replace("{%country%}", orgVal.location.country);
 temperature = temperature.replace("{%weather%}", orgVal.current.condition.text );
 
return temperature;
}




const server = http.createServer((req, res) => {
if(req.url=="/"){
requests('http://api.weatherapi.com/v1/current.json?key=1a4d918d0f4540b2a9b121409212109&q=Lahore&aqi=no')
.on('data',(chunk) =>{
    const obj = JSON.parse(chunk);
    const arr = [obj];
    const realTimeData = arr.map((val) => replaceVal(homeFile,val)).join("");
    res.end(realTimeData);

})
.on('end',(err)=> {
  if (err) return console.log('connection closed due to errors', err);
   res.end("");
});
}

    if(req.url=="/style.css"){
        const read = fs.createReadStream('style.css')
        res.writeHead(200,{'Content-type':'text/css'});
        read.pipe(res);

    }

 
});

server.listen(port,"127.0.0.1");
