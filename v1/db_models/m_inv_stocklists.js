const structure = require("../../Infrastructure/structure");
const m_pricelists = require("./inv/pricelist/m_inv_pricelists");
const m_prices = require("./inv/pricelist/m_inv_prices");
const m_stocks = require("./m_inv_stocks");
const errMsg = "DB Error - ";
module.exports = class product_stocklists {
    static getStockHistoryMinMaxId(companyId, max, sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).aggregate(
                    this.getStockListsAggregateArray({companyId})
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id: -1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getStockHistoryMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static getStockLists(companyId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getStockListsAggregateArray({companyId})
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: -1})
                .skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getStockLists";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
            })
        })
    }
    static getStockListsAggregateArray(match){
        return [
            {
                $lookup : {
                    from : m_stocks.name,
                    localField : "stockIds",
                    foreignField : "_id",
                    as : "stocks"
                }
            },{
                $lookup : {
                    from : m_pricelists.name,
                    localField : "_id",
                    foreignField : "stocklistId",
                    as : "pricelist",
                }
            },{
                $unwind : {
                    path : "$pricelist",
                    preserveNullAndEmptyArrays : true
                }
            },{
                $addFields : {
                    _priceIds : {
                        $map : {
                            input : "$pricelist.list",
                            in : {$toObjectId : "$$this"}
                        }
                    }
                }
            },{
                $lookup : {
                    from : m_prices.name,
                    localField : "_priceIds",
                    foreignField : "_id",
                    as : "prices",
                }
            },{
                $match : match
            }
        ]
    }
    static createStocklist(companyId, stocklistObject, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                stocklistObject = {...stocklistObject, companyId};
                client.collection(this.name).insertOne(stocklistObject, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "createStocklist";
                        reject(error);
                        callback(error);
                    }else{
                        res();
                        resolve(result.ops[0]);
                        if(callback) callback(err, result.ops[0]);
                    }
                })
            })
        })
    }
}