const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_stocks{
    static getLastStocksByUniqueProductIds(productIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $match : {productId : {$in : productIds}}
                    },{
                        $group : {
                            _id : "$productId",
                            id : {$max : "$_id"},
                            cost : { $last : "$cost"},
                            minPackQuantity : {$last : "$minPackQuantity"}
                        }
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getLastStocksByUniqueProductIds";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getStocksByProductIds(productIds, storeId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = storeId === "all" ? 
                    {productId : {$in : productIds}} : 
                    {"productId" : {"$in" : productIds}, storeId};
                client.collection(this.name).aggregate([
                    {
                        $match : match
                    },{
                        $group : {
                            _id : {productId : "$productId"},
                            stock : {$sum : "$rMinPackQuantity"}
                        }
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getStocksByProductIds";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static createStocks(list, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertMany(list, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "createStocks";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result.ops);
                        if(callback) callback(err, result.ops);
                    }
                })
            })
        })
    }
}