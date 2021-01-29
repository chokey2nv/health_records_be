const structure = require('../../../../Infrastructure/structure');
const errMsg = "Error DB -";
module.exports = class product_drugstrength {
    static getDrugStrengthByName(name, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name}, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getDrugStrengthByName";
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
    static createDrugStrength(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createDrugStrength";
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
    static searchDrugStrength(keyword, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {name : new RegExp(".*"+keyword+".*", "i")}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchDrugStrength";
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