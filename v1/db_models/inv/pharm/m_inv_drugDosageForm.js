const structure = require('../../../../Infrastructure/structure');
const errMsg = "DB Error -";
module.exports = class product_drugdosageform {
    static getDrugDosageByName(name, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name}, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getDrugDosageByName";
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
    static createDrugDosage(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createDrugDosage";
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
    static searchDosageForm(keyword, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {name : new RegExp(".*"+keyword+".*", "i")}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchDosageForm";
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