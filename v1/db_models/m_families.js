const structure = require("../../Infrastructure/structure");
const m_patients = require("./m_patients");
let errMsg = "DB Error! ";
module.exports = class families{
    static patientIsAFamilyMember(patientId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {members : patientId},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "patientIsAFamilyMember";
                            reject(eror);
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
    static deleteFamilyMember(familyId, patientId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : familyId},
                    {$pull : {members : patientId}},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteFamilyMember";
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
    static addFamilyMembers(familyId, members, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : familyId},
                    {$set : {members}},
                    {upsert : true},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addFamilyMembers";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback)callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static getAFamily(familyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $lookup : {
                            from : m_patients.name,
                            localField : "members",
                            foreignField : "_id",
                            as : "familyMembers"
                        }
                    },{
                        $match : {_id : familyId}
                    }
                ]).toArray((err, result)=>{ console.log(result);
                    if(err){
                        rej(err);
                        const error = errMsg + "getAFamily";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        result = result && result[0] ? result[0] : null;
                        resolve(result);
                        if(callback)callback(err, result);
                    }
                });
            })
        })
    }
    static getFamilies(rows, skip, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find().
                sort({_id :-1}).skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        const error = errMsg + "getFamilies";
                        rej(err);
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        });
    }
    static deleteFamily(familyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : familyId},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteFamily";
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
    static editFamilyRecord(familyId, data, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).update(
                    {_id : familyId},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(errK);
                            const error = errMsg + "editFamilyRecord";
                            reject(error);
                            if(callback) callback(error);
                        }else {
                            res();
                            resolve(result.result);
                            if(callback) callback(result.result);
                        }
                    }
                )
            })
        })
    }
    static createFamilyRecord(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms( async (client, res, rej)=>{
                const collection = client.collection(this.name);
                data._id = await structure.db.autoIncrement(collection);
                data.createdDate = new Date();
                collection.insertOne(data, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "createFamilyRecord";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result.ops[0]);
                        if(callback) callback(err, result.ops[0]);
                    }
                })
            })
        })
    }
    static getMinMaxId(type, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const sort = type === "max" ? {_id : -1} : {_id : 1};
                client.collection(this.name).find().sort(sort).
                limit(1).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getMaxId";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        const id = result && result[0] ? result[0]._id : 0;
                        resolve(id);
                        if(callback) callback(err, id);
                    }
                })
            })
        })
    }
}