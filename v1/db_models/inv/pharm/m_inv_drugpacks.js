const structure = require('../../../../Infrastructure/structure');
module.exports = class product_drugpacks {
    static getDrugPackByName(name, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {name}, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getDrugPackByName";
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
    static createDrugPack(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createDrugPack";
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
    static searchDrugPack(keyword, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {name : new RegExp(".*"+keyword+".*", "i")}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchDrugPack";
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