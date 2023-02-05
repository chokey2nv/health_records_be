const structure = require('../../../../Infrastructure/structure');
const errMsg = "DB Error - ";
module.exports = class product_prices {
    static editProductPrices(priceId, price, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(priceId)},
                    {$set : {price}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editProductPrices";
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
    static getPricesByProductIds(productIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $match : {
                            productId : {$in : productIds},
                            event : {$exists : false}
                        }
                    },{
                        $group:{
                            _id : "$productId",
                            id : {$max : "$_id"},
                            price : { $last : "$price"}
                        }
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPricesByProductIds";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
    static createPrices(companyId, list, event, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const prices = Object.entries(list).map(item=>({
                    productId : item[0], 
                    price : item[1], 
                    actionDate : new Date(),
                    companyId,
                    event : event ? true : false
                }));
                client.collection(this.name).insertMany(prices, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "createPrices";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result.ops);
                        if(callback) callback(result.ops);
                    }
                })
            })
        })
    }
}