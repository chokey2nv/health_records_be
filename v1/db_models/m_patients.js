const structure = require("../../Infrastructure/structure");
let errMsg = "DB Error! ";
module.exports = class patients {
    static removeFamilyId(patientId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : patientId},
                    {$set : {familyId : null}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addFamilyId";
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
    static addFamilyId(patientId, familyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : patientId},
                    {$set : {familyId}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "addFamilyId";
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
    static getPatientDayTotalCount(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientDayTotalCount";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, 
                            year : {$year : "$created"},
                            month : {$month : "$created"},
                            day : {$dayOfMonth : "$created"}
                        }
                    },{
                        $match : {year, month, day}
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month", day : "$day"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPatientMonthTotalCount(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientMonthTotalCount";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, 
                            year : {$year : "$created"},
                            month : {$month : "$created"},
                        }
                    },{
                        $match : {year, month}
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPatientYearTotalCount(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientYearTotalCount";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, 
                            year : {$year : "$created"},
                        }
                    },{
                        $match : {year}
                    },{
                        $group : {
                            _id : {year : "$year"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }

    static getPatientMonthDayData(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientMonthDayData";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, 
                            year : {$year : "$created"},
                            month : {$month : "$created"},
                            day : {$dayOfMonth : "$created"}
                        }
                    },{
                        $match : {year, month}
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month", day : "$day"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPatientYearMonthData(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientYearMonthData";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, 
                            year : {$year : "$created"},
                            month : {$month : "$created"}
                        }
                    },{
                        $match : {year}
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    //for online medical app
    static _getSearchMinMaxPatientId(companyId, keyword, maxMin, sort, callback){
        //also modify in search patient
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSearchMinMaxPatientId";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        const id = result && result[0] ? result[0]._id : 0;
                        resolve(id);
                        if(callback)callback(err, id);
                    }
                }
                // sort = maxMin === "max" ? {_id : -1} : {_id : 1};
                const querySort = sort ? {[sort] : max ? -1 : 1 } : {_id: max? -1 : 1}
                if(isNaN(Number(keyword))){
                    const reValue = new RegExp(".*"+keyword+".*", "i");
                    collection.find(
                        {companyId, $or : [
                            {"myProfile.lastName" : {"$regex" : reValue}},
                            {"myProfile.firstName" : {"$regex" : reValue}},
                            {"myProfile.middleName" : {"$regex" : reValue}}
                        ]}
                    ).sort(querySort).limit(1).toArray(response);
                }else {
                    keyword=parseInt(keyword);
                    collection.find(
                        {companyId, $or: [{_id : {$in : [keyword]}}, {"myProfile.oldId" : {$in : [keyword]}}]}
                    ).sort(querySort).limit(1).toArray(response);
                }
            })
        });
    }
    static getSearchMinMaxPatientId(keyword, maxMin, sort, callback){
        //also modify in search patient
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getSearchMinMaxPatientId";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        const id = result && result[0] ? result[0]._id : 0;
                        resolve(id);
                        if(callback)callback(err, id);
                    }
                }
                // sort = maxMin === "max" ? {_id : -1} : {_id : 1};
                const querySort = sort ? {[sort]  : maxMin === "max" ? -1 : 1} : 
                    {_id : maxMin === "max" ? -1 : 1};
                if(isNaN(Number(keyword))){
                    const reValue = new RegExp(".*"+keyword+".*", "i");
                    collection.find(
                        {$or : [
                            {"myProfile.lastName" : {"$regex" : reValue}},
                            {"myProfile.firstName" : {"$regex" : reValue}},
                            {"myProfile.middleName" : {"$regex" : reValue}}
                        ]}
                    ).sort(querySort).limit(1).toArray(response);
                }else {
                    keyword=parseInt(keyword);
                    collection.find(
                        {$or: [{_id : {$in : [keyword]}}, {"myProfile.oldId" : {$in : [keyword]}}]}
                    ).sort(querySort).limit(1).toArray(response);
                }
            })
        });
    }
    static _searchPatient(companyId, keyword,rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPatient";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }
                }
                if(isNaN(Number(keyword))){
                    const reValue = new RegExp(".*"+keyword+".*", "i");
                    collection.find(
                        {companyId, $or : [
                            {"myProfile.lastName" : {"$regex" : reValue}},
                            {"myProfile.firstName" : {"$regex" : reValue}},
                            {"myProfile.middleName" : {"$regex" : reValue}}
                        ]}
                    ).
                    sort(sort ? {_id : max ? -1 : 1} : {_id : -1}).
                    skip(skip).limit(rows).toArray(response);
                }else {
                    keyword=parseInt(keyword);
                    collection.find(
                        {$or: [{_id : {$in : [keyword]}}, {"myProfile.oldId" : {$in : [keyword]}}]}
                    ).
                    sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                    skip(skip).limit(rows).toArray(response);
                }
            })
        })
        
    }
    static searchPatient(keyword,rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPatient";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }
                }
                if(isNaN(Number(keyword))){
                    const reValue = new RegExp(".*"+keyword+".*", "i");
                    collection.find(
                        {$or : [
                            {"myProfile.lastName" : {"$regex" : reValue}},
                            {"myProfile.firstName" : {"$regex" : reValue}},
                            {"myProfile.middleName" : {"$regex" : reValue}}
                        ]}
                    ).
                    // sort(sort ? {_id : max ? -1 : 1} : {_id : -1}).
                    sort({"myProfile.lastName" : 1}).
                    skip(skip).limit(rows).toArray(response);
                }else {
                    keyword=parseInt(keyword);
                    collection.find(
                        {$or: [{_id : {$in : [keyword]}}, {"myProfile.oldId" : {$in : [keyword]}}]}
                    ).sort({"myProfile.lastName" : 1}).skip(skip).limit(rows).toArray(response);
                }
            })
        })
        
    }
    static editRecord(patientId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : patientId},
                    {$set : {myProfile : data}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editRecord";
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
    static getAPatient(patientId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {_id : patientId},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getAPatient";
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
    static migratePatientData(patients, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms(async(client, res, rej)=>{
                let result;
                for (let i = 0; i < patients.length; i++) {
                    const patient = patients[i];
                    try{
                        const collection = client.collection(this.name);
                        patient._id = await structure.db.autoIncrement(collection);
                        result = await collection.insertOne(patient);                        
                    }catch(err){
                        rej(err);
                        const error = errMsg + "migratePatientData";
                        reject(error);
                        if(callback)callback(error)
                        return;
                    }
                }
                res();
                resolve(result);
                if(callback) callback(result);
            });
        });
    }
    static getPatientsByIds(patientIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {_id : {$in : patientIds}}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientsByIds";
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
    static getPatientsByOldIds(patientIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {"myProfile.oldId" : {$in : patientIds}}
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientsByOldIds";
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
    static _getPatients(companyId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=> {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatients";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                }
                collection.find({companyId}).
                sort(sort ? {_id : max ? -1 : 1} : {_id : -1}).
                skip(skip).
                limit(rows).
                toArray(response);
            })
        })
    }
    static getPatients(rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result)=> {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatients";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                }
                collection.find().
                sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).
                limit(rows).
                toArray(response);
            })
        })
    }
    static createRecord(userId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                structure.db.autoIncrement(collection, _id=>{
                    const record = {
                        _id, myProfile : data,
                        by : userId,
                        created : new Date(),
                    };
                    collection.insertOne(record, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createRecord";
                            reject(error);
                            if(callback) callback(error); 
                        }else {
                            res();
                            resolve(result.ops[0]);
                            if(callback) callback(err, result.ops[0]);
                        }
                    })
                })
            })
        })
    }
    static getMaxId(sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find()
                .sort(sort ? {[sort] : -1} : {_id: -1})
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
    static getMinId(sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find()
                .sort(sort ? {[sort] : 1} : {_id: 1})
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
                            if (callback) callback(parseInt(result[0]._id));
                            resolve(parseInt(result[0]._id));
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
    static updatePatientQuery(query, update, options, many, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "updatePatientQuery";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result.result);
                        if(callback) callback(err, result.result);
                    };
                }
                const collection = client.collection(this.name);
                if(many) collection.updateMany(query, update, options, response);
                else collection.updateOne(query, update, options, response);
            })
        })
    }
}