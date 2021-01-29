const structure = require("../../Infrastructure/structure");
const errMsg = "DB Error - ";
module.exports = class product_suppliers{
    static searchSupplierMinMaxId(companyId, keyword, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    {companyId, name : '/' +keyword + '/'}
                )
                .sort({_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchSupplierMinMaxId";
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
    static searchSuppliers(companyId, keyword, rows, skip, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId, name : new RegExp(".*"+keyword+".*", "i")}
                ).skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchSuppliers";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            });
        });
    }
    static getSuppliers(companyId, rows, skip, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).
                find({companyId}).sort({_id : -1}).skip(skip).limit(rows).
                toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSuppliers";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            });
        });
    }
    static getMinMaxId(companyId, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    {companyId}
                ).sort({_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        reject(err);
                        // resolve(null);
                        if(callback) callback(err)
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
    static supplierNameExist(name, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "supplierNameExist";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result);
                            if(callback) callback(result);
                        }
                    }
                )
            });
        });
    }
    static createSupplier(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createSupplier";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops[0]);
                            if(callback) callback(result.ops[0]);
                        }
                    }
                )
            })
        })
    }
}