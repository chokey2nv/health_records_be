const structure = require('../../../../Infrastructure/structure');
const errMsg = "DB Error -";
module.exports = class product_drugCategory {
    static addCategoryMember(categoryId, drugId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(categoryId)},
                    {$push : {drugIds : drugId}},
                    {upsert : true},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addCategoryMember";
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
    static createDrugCategory(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createDrugCategory";
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
    static searchDrugCategory(keyword, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {name : new RegExp(".*"+keyword+".*", "i")}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchDrugCategory";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result)
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
}