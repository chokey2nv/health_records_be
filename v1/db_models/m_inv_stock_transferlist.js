const structure = require('../../Infrastructure/structure');
const m_stock_transfers = require("./m_inv_stock_transfer");
const m_stores = require("./m_inv_stores");
const errMsg = "DB Error ";
module.exports = class product_stock_transferlist{

    static getSearchTransferListMinMaxId (companyId, storeId, keyword, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                let match = {companyId, name : new RegExp(".*"+keyword+".*", "i")};
                if(storeId !== "all")
                    match = {...match, $or : [{fromStoreId : storeId}, {toStoreId : storeId}]}
                client.collection(this.name).aggregate(
                    this.getStockTransferListAggregate(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id: -1})
                .limit(1).toArray((err, result)=>{ 
                    if(err) {
                        rej(err)
                        const error = errMsg + "getSearchTransferListMinMaxId";
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
                
            })
        });
    }
    static searchTransferList (companyId, storeId, keyword, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                let match = {companyId, name : new RegExp(".*"+keyword+".*", "i")};
                if(storeId !== "all")
                    match = {...match, $or : [{fromStoreId : storeId}, {toStoreId : storeId}]}
                client.collection(this.name).aggregate(
                    this.getStockTransferListAggregate(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchTransferList";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
                
            })
        });
    }
    static getStockTransferListMinMaxId (companyId, storeId, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = storeId === "all" ? 
                    {companyId} : {
                        companyId, $or : [{fromStoreId : storeId}, {toStoreId : storeId}]
                    }
                client.collection(this.name).aggregate(
                    this.getStockTransferListAggregate(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id: -1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getStockTransferListMinMaxId";
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
    static getStockTransferList(companyId, storeId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = storeId === "all" ? 
                    {companyId} : {
                        companyId, $or : [{fromStoreId : storeId}, {toStoreId : storeId}]
                    }
                client.collection(this.name).aggregate(
                    this.getStockTransferListAggregate(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getStockTransferList";
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
    static getStockTransferListAggregate(match){
        return [
            {
                $addFields : {
                    _fromStoreId : {$toObjectId : "$fromStoreId"},
                    _toStoreId : {$toObjectId : "$toStoreId"},
                }
            },{
                $lookup : {
                    from : m_stock_transfers.name,
                    localField : "stockIds",
                    foreignField : "_id",
                    as : "stocks"
                }
            },{
                $lookup : {
                    from : m_stores.name,
                    localField : "_fromStoreId",
                    foreignField : "_id",
                    as : "fromStore",
                }
            },{
                $lookup : {
                    from : m_stores.name,
                    localField : "_toStoreId",
                    foreignField : "_id",
                    as : "toStore",
                }
            },{
                $match : match
            }
        ]
    }
    static createTransferlist(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createTransferlist";
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