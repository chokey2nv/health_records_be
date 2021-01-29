const structure = require('../../../../Infrastructure/structure');
const m_dosageForms = require('./m_inv_drugDosageForm');
const m_drugnames = require('./m_inv_drugnames');
const m_packs = require('./m_inv_drugpacks');
const m_strengths = require('./m_inv_drugstrength');
const errMsg = "DB Error -";
module.exports = class product_drugs {
    static getDrugsByIds(drugIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDrugsAggregateArray({_id : {$in : drugIds}})
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getDrugsByIds";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
    static drugExists(data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "drugExists";
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
    static getDrugMinMaxIds(companyId, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDrugsAggregateArray({companyId})
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getDrugMinMaxIds";
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
            })
        })
    }
    static getDrugs(companyId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDrugsAggregateArray({companyId})
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: -1})
                .skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getDrugs";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
            })
        })
    }
    static getDrugsAggregateArray(match){
        return [
            {
                $addFields : {
                    _nameIds : {
                        $map : {
                            input : "$nameStrengths",
                            in : "$$this.nameId"
                        }
                    },
                    _strengthIds : {
                        $map : {
                            input : "$nameStrengths",
                            in : "$$this.strengthId",
                        }
                    }
                }
            },{
                $lookup : {
                    from : m_dosageForms.name,
                    localField : "dosageFormId",
                    foreignField : "_id",
                    as : "dosageForm"
                }
            },{
                $unwind : {
                    path : "$dosageForm",
                    preserveNullAndEmptyArrays : true
                }
            },{
                $lookup : {
                    from : m_packs.name,
                    localField : "packId",
                    foreignField : "_id",
                    as : "pack"
                }  
            },{
                $unwind : {
                    path : '$pack',
                    preserveNullAndEmptyArrays : true
                }
            },{
                $lookup : {
                    from : m_drugnames.name,
                    localField : "_nameIds",
                    foreignField : "_id",
                    as : "names"
                }  
            },{
                $lookup : {
                    from : m_strengths.name,
                    localField : "_strengthIds",
                    foreignField :"_id",
                    as : "strengths"
                }  
            },{
                $match : match
            }
        ]
    }
    static updateDrug(drugId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : drugId}, {$set : data},
                    {upsert : true},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updateDrug";
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
    static addDrugCatogoryId(drugId, categoryId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : drugId}, {$push : {categoryIds : categoryId}},
                    {upsert : true}, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addDrugCatogoryId";
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
    static createDrug(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res,rej)=>{
                data = {...data, companyId}
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createDrug";
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
}