const structure = require("../../Infrastructure/structure");
let errMsg = "DB Error! ";
module.exports = class settings {
    static _createSettings(companyId, settings, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                settings = settings && settings.map(item=>({...item, companyId}));
                client.collection(this.name).insertMany(
                    settings, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "_createSettings";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops);
                            if(callback) callback(err, result.ops);
                        }
                    }
                )
            })
        });
    }
    static _getSettings(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find({companyId}).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSettings";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
    static getSettingsByNames(names, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {name : {$in : names}},
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSettingsByNames";
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
    static editSettingValue(settingId, valueName, value, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "editSettingValue";
                        reject(error);
                        if(callback) callback(error)
                    }else{
                        res();
                        resolve(result.result);
                        if(callback) callback(err, result.result);
                    }
                }
                if(valueName) client.collection(this.name).updateOne(
                    {
                        _id : structure.db.ObjectId(settingId),
                        values : {$elemMatch : {name : valueName}}
                    },
                    {$set : {"values.$.value" : value}},
                    {upsert : true},
                    response
                ); else client.collection(this.name).updateOne(
                    {
                        _id : structure.db.ObjectId(settingId)
                    },
                    {$set : {value}},
                    {upsert : true}, 
                    response
                );
            })
        })
    }
    static deleteSettingValue(settingId, valueName, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(settingId)},
                    {$pull : {values : {name : valueName}}},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteSettingValue";
                            reject(error);
                            if(callback) callback(error);
                        }else {
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static addSettingValue(settingId, valuesObject, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(settingId)},
                    {$push : {values : valuesObject}},
                    {upsert : true},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "addSettingValue";
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
    static getSettings(callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find().toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSettings";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
    static createSettings(settings, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertMany(
                    settings, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createSettings";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops);
                            if(callback) callback(err, result.ops);
                        }
                    }
                )
            })
        });
    }
}