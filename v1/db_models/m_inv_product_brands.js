const structure = require("../../Infrastructure/structure");
const m_supplier = require("./m_inv_suppliers");
const m_forms = require("./m_inv_productForms");
const m_packagings = require("./m_inv_productPackagings");
const m_drugNames = require("./m_inv_drugNames");
const errMsg = "DB Error - ";
module.exports = class product_brands{
    static deleteMultipleBrand(brandIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                brandIds = brandIds.map(item=>structure.db.ObjectId(item));
                client.collection(this.name).deleteMany(
                    {_id : {
                        $in : brandIds
                    }},
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteMultipleBrand";
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
    static deleteBrand(brandId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(brandId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteBrand";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.resutl);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static editBrand(brandId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(brandId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editBrand";
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
    static getABrand(brandId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getBrandsAggregateArray(
                        {_id : structure.db.ObjectId(brandId)}
                    )
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getABrand";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result && result[0]);
                        if(callback) callback(err, result && result[0]);
                    }
                });
            })
        });
    }
    static searchBrand(companyId, type, keyword, rows, skip, sort, max, callback){ 
        let match = {companyId, name :new RegExp(".*"+keyword+".*", "i")};
        switch(type){
            case "nonPharm" : match.drugId = {$exists : false}; break;
            case "pharm" : match.drugId = {$exists : true}; break;
        }
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getBrandsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray(
                    (err, result)=>{ 
                        if(err){
                            rej(err);
                            const error = errMsg + "searchBrand";
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
        });
    }
    static getBrands(companyId, type, rows, skip, sort, max, callback){ 
        let match = {companyId};
        switch(type){
            case "nonPharm" : match.drugId = {$exists : false}; break;
            case "pharm" : match.drugId = {$exists : true}; break;
        }
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getBrandsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray(
                    (err, result)=>{ 
                        if(err){
                            rej(err);
                            const error = errMsg + "getBrands";
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
        });
    }
    static getBrandsAggregateArray(match){
        return [
            {
                $addFields : {
                    _supplierId : {$toObjectId : "$supplierId"},
                    _formId : {$toObjectId : "$formId"},
                    _packagingId : {$toObjectId : "$packagingInfo.packagingId"},
                    _drugIds : { 
                        $map : {
                            input : "$drugInfo.drugIds",
                            in : { $toObjectId : "$$this"}
                        }
                    }
                }
            },{
                $lookup : {
                    from : m_drugNames.name,
                    localField : "_drugIds",
                    foreignField : "_id",
                    as : "drugInfo.drugNames",
                }
            },{
                $lookup : {
                    from : m_packagings.name,
                    localField : "_packagingId",
                    foreignField : "_id",
                    as : "packaging"
                }
            },{
                $unwind : {
                    path : "$packaging",
                    preserveNullAndEmptyArrays : true
                }
            },{
                $lookup : {
                    from : m_supplier.name,
                    localField : "_supplierId",
                    foreignField : "_id",
                    as : "supplier"
                }
            },{
                $unwind : {
                    path : "$supplier",
                    preserveNullAndEmptyArrays : true,
                }
            },{
                $lookup : {
                    from : m_forms.name,
                    localField : "_formId",
                    foreignField : "_id",
                    as : 'form',
                }
            },{
                $unwind : {
                    path : "$form",
                    preserveNullAndEmptyArrays : true,
                }
            },{
                $match : match,
            }
        ]
    }
    static createBrand(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId};
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createBrand";
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
    static getBrandSearchMinMaxId(companyId, type, keyword, max, sort, callback){
        let match = {companyId, name : new RegExp(".*"+keyword+".*", "i")};
        switch(type){
            case "nonPharm" : match.drugId = {$exists : false}; break;
            case "pharm" : match.drugId = {$exists : true}; break;
        }
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    match
                )
                .sort(sort ? {[sort] : max ? -1 : 1} : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchMinMaxId";
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
    static getBrandMinMaxId(companyId, type, max, sort, callback){
        let match = {companyId};
        switch(type){
            case "nonPharm" : match.drugId = {$exists : false}; break;
            case "pharm" : match.drugId = {$exists : true}; break;
        }
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    match
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchMinMaxId";
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
}