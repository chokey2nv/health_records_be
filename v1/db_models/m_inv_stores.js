const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_stores{
    static getAStoreByName(name, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getAStoreByName";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result);
                            if(callback) callback(err, result);
                        }
                    }
                )
            })
        })
    }
    static editStore(storeId, data, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(storeId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editStore";
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
    static deleteStore(storeId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(storeId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteStore";
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
    static getStores(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getStores";
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
    static createStore(companyId, data, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "createStore";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result);
                            if(callback) callback(err, result);
                        }
                    }
                )
            })
        })
    }
}