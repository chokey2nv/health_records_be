var express = require('express');
var bodyParser = require('body-parser');
var webHandler = require('./handler');
var hirWorker = require("./v1/apps/hir/workers/hir_woker");

var cors = require("cors");
const path = require("path");
const localIpUrl = require('local-ip-url')
require('dotenv').config(); 

var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//heroku step one
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use((req, res, next)=>{
    req.query.userId = parseInt(req.query.userId);
    if(req.params.action === "login" || hirWorker.verifyToken(req.query))
        next();
    else res.send({[req.params.action] : false, message : "Access denied"});
})
app.use("/loginImages", express.static(__dirname+"/Infrastructure/static_background"))
app.use('/image', express.static(__dirname + '/files/media/images'));
//server presentation "localhost:8080/web/agroblog/v1/:owner/:action"
app.get('/api/:version/:app/:owner/:action', jsonParser, function(req, res){
    if(req.params.action === "getLocalIP"){
        res.send({getLocalIP : true, result : {ip : localIpUrl() + ":"+PORT}});
    }else webHandler(req, res);
});

app.post('/api/:version/:app/:owner/:action', jsonParser, function(req, res){
    webHandler(req, res);
});

app.post('/api/:version/enc/:app/:owner/:action', urlencodedParser, function(req, res){
    if(process.env.NODE_ENVIRONMENT === "development"){
    }
    webHandler(req, res);
});
//for production
app.use('/', express.static(__dirname + '/build'));

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html')); //relative path
});

app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT);
})