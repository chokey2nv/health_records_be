const structure = require("../../Infrastructure/structure");
const errMsg = "Db Error --- ";
module.exports = class product_packages{
    static getProductPackagesByIds(ids, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            convertedId : {$toString : "_id"}
                        }
                    },{
                        $match : {
                            convertedId : {$in : ids}
                        }
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductPackagesByIds";
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
    static editProductPackage(companyId, packageId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(packageId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editProductPackage";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            });
        });
    }
    static addProductPackage(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data,
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addProductPackage";
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
    static getProductPackages(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductPackages";
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
    static deleteProductPackage(companyId, packageId, callback){console.log(companyId, packageId)
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(packageId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteProductPackage";
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