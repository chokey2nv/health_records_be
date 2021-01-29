const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_stock_transfer{
    static getStocksByProductIds(productIds, storeId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = storeId === "all" ? 
                    {productId : {$in : productIds}} : 
                    {
                        "productId" : {"$in" : productIds}, 
                        $or : [{storeId}, {fromStoreId : storeId}]
                    };
                client.collection(this.name).aggregate([
                    {
                        $match : match
                    },{
                        $group : {
                            _id : {productId : "$productId", fromStoreId : "$fromStoreId"},
                            stock : {$sum : "$rMinPackQuantity"}
                        }
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getStocksByProductIds - transfer";
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
    static transferStocks(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertMany(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "transferStocks";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops);
                            if(callback) callback(err, result.ops);
                        }
                    }
                )
            })
        })
    }
}