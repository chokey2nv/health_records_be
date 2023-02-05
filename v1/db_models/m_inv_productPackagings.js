const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_packagings{
    static getProductPackagingByIds(packagingIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                packagingIds = packagingIds.map(item=>structure.db.ObjectId(item));
                client.collection(this.name).find(
                    {_id : {$in : packagingIds}}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductPackagingByIds";
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
    static getAProductPackaging(packagingId, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {_id : structure.db.ObjectId(packagingId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getAProductPackaging";
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
    static deleteProductPackaging(packagingId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(packagingId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteProductPackaging";
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
    static editPackaging(packagingId, packageIds, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(packagingId)}, 
                    {$set : {packageIds}},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "editPackaging";
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
    static packagingExists(packageIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {packageIds},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "packagingExists";
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
    static createProductPackaging(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data,
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createProductPackaging";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result);
                            if(callback) callback(result);
                        }
                    }
                )
            })
        })
    }
    static getProductPackagings(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductPackagings";
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