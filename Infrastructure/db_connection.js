const MongoClient = require('mongodb').MongoClient, 
Server = require('mongodb').Server,
ObjectId = require("mongodb").ObjectId;


const assert = require('assert');

//heroku step 2
// Connection URL
const url = process.env.MONGODB_URI || process.env.MY_DB_URI || "mongodb://localhost:27017"
// Database Name
const host = '127.0.0.1';
const port = 27017;
const database = "hms";
const connUrl = `mongodb://${host}:${port}`
//mongodb://chokey2nv:password123@ds149732.mlab.com:49732/agroblog


var globalDbConnection;
if(url){
    globalDbConnection = function(url){ 
        return function(database, callback){
            // var mongocl = new MongoClient(new Server(host, port));
            // mongocl.connect(function(err, mongoClient) {
                MongoClient.connect(url, (err, mongoClient)=>{
                assert.equal(null, err);

                const dbClient = mongoClient.db(database);
                var dbWork = new Promise(
                    function(resolve, reject){
                        callback(dbClient, resolve, reject);
                    }
                );
                dbWork.then(function(){
                    mongoClient.close();                
                }).catch((err)=>{
                    console.error(err);
                    mongoClient.close();
                });
            });
        }
    }(url);
}else{
    globalDbConnection = function(host, port){ 
        return function(database, callback){
            var mongocl = new MongoClient(new Server(host, port));
            mongocl.connect(function(err, mongoClient) {
                const dbClient = mongoClient.db(database);
                var dbWork = new Promise(
                    function(resolve, reject){
                        callback(dbClient, resolve, reject);
                    }
                );
                dbWork.then(function(){
                    mongoClient.close();                
                }).catch((err)=>{
                    console.error(err);
                    mongoClient.close();
                });
            });
        }
    }(host, port);
}

var hms = function(database){
    return function(callback){
        globalDbConnection(database, callback);
    }
}(database);

var autoIncrement = function(collectionClient, callback){
    return new Promise (resolve => {
        collectionClient.find().sort({_id: -1}).limit(1).toArray((err, result)=>{
            if(err) {
                reject(err);
                // resolve(null);
                if(callback) callback(err)
            }
            else{
                if(result.length != 0 ) {
                    if (callback) callback(parseInt(result[0]._id) + 1);
                    resolve(parseInt(result[0]._id) + 1);
                }
                else {
                    console.log("array is empty")
                    if(callback) callback(1);     //converted back to int
                    resolve(1);
                }
            }
        });
    });
}



module.exports = {
    globalDbConnection, hms, ObjectId, autoIncrement,
    dbHost: host, dbPort: port, dbUrl: connUrl
}