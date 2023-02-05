const structure = require("../../Infrastructure/structure");
const m_patients = require("./m_patients");
let errMsg = "DB Error! ";
module.exports = class product_description {
    static createProductDescription(companyId, description, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                description = {...description, companyId};
                client.collection(this.name).insertOne(
                    description,
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error  = errMsg + "createProductDescription";
                            reject(error);
                            if(callback)callback(error);
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
    static getProductDescriptions(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {companyId}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error  = errMsg + "getProductDescriptions";
                        reject(error);
                        if(callback)callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
}