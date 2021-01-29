const structure = require('../../../../Infrastructure/structure');
const hmsUtils = require('../../../../utils/Utils');
const errMsg = "DB Error - ";
module.exports = class product_sales {
    static updateSales(saleIds, updateObject, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).updateMany(
                    {_id : {$in : saleIds}},
                    {$set : updateObject},
                    {upsert : true, multi : true},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updateSales";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static createSale(companyId, userId, sale, callback){
        sale = sale.map(item=>({
            ...item, companyId, 
            by : userId, 
            actionDate : new Date(hmsUtils.getThisDate())
        }));
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertMany(
                    sale, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createSale";
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