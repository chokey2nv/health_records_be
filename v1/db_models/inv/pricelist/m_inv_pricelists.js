const structure = require("../../../../Infrastructure/structure");
const m_prices = require('./m_inv_prices');
//pricelist is already imported in stocklist, so i have to write it literal than using class name
// const m_stocklist = require("../../m_inv_stocklists");
const errMsg = "DB Error - ";
module.exports = class product_pricelists{
    static getSearchPricelistMinMaxIds(companyId, keyword, sort, max, event, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getPricelistsAggregateArray({
                        companyId,
                        "stocklist.name" : new RegExp(".*"+keyword+".*", "i"),
                    }, event)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getSearchPricelistMinMaxIds";
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
    static searchPricelists(companyId, keyword, rows, skip, sort, max, event, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getPricelistsAggregateArray({
                        companyId,
                        "pricelist.name" : new RegExp(".*"+keyword+".*", "i"),
                    }, event)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPricelists";
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
    static getPricelistMinMaxIds(companyId, sort, max, event, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getPricelistsAggregateArray({companyId}, event)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getPricelistMinMaxIds";
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
    static getPricelists(companyId, rows, skip, sort, max, event, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getPricelistsAggregateArray({companyId}, event)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPricelists";
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
    static getPricelistsAggregateArray(match, events){
        return [
            {
                $lookup : {
                    from : m_prices.name,
                    localField : "list",
                    foreignField : "_id",
                    as : "prices"
                }
            },{
                $lookup : {
                    from : "product_stocklists",
                    localField : "stocklistId",
                    foreignField : "_id",
                    as : "stocklist",
                }
            },{
                $unwind : {
                    path : "$stocklist",
                    preserveNullAndEmptyArrays : true
                }
            },{
                $addFields : {
                    "stocklist._stockIds" : {
                        $map : {
                            input : "$stocklist.stockIds",
                            in : {$toObjectId : "$$this"}
                        }
                    }
                }
            },{
                $lookup : {
                    from : "product_stocks",
                    localField : "stocklist._stockIds",
                    foreignField : "_id",
                    as : "stocklist.stocks",
                }
            },{
                $match : {...match, startDate : {$exists : events}},
            }
        ]
    }
    static createPricelist(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createPricelist";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops[0]);
                            if(callback) callback(err, result.ops[0]);
                        }
                    }
                )
            })
        })
    }
}