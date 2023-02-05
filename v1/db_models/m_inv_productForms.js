const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_forms{
    static updateProductForm(productFormId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(productFormId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updateProductForm";
                            reject(error);
                            if(callback) callback(err);
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
    static deleteProductForm(productFormId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(productFormId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteProductForm";
                            reject(error);
                            if(callback) callback(err);
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
    static createProductForm(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createProductForm";
                            reject(error);
                            if(callback) callback(err);
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
    static productFormExists(name, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name},
                    (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "productFormExists";
                        reject(error);
                        if(callback) callback(err);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getProductForms(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductForms";
                        reject(error);
                        if(callback) callback(err);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
}