const structure = require("../../Infrastructure/structure");
const m_patients = require("./m_patients")
const m_users = require("./m_users");
const myUtils = require("../../utils/Utils");
const Utils = require("../../utils/Utils");
let errMsg = "DB Error! ";
module.exports = class deposits {
    static getDepositGroup(filter, group, callback) {
        return new Promise((resolve, reject) => {
            structure.db.hms((client, res, rej)=>{
                const {startDate, endDate, date, ..._filter} = filter;
                let match = {..._filter};
                if(startDate){
                    if(!startDate) throw("No start date found");
                    else if(!endDate) throw("No end date fount");
                    match = {
                        ...filter, $and : [
                        {actionDate : {$gte : myUtils.getStandardFromLocale(new Date(startDate).toLocaleDateString())} }, 
                        {actionDate : {$lte : myUtils.getStandardFromLocale(new Date(endDate).toLocaleDateString())} }, 
                    ]}
                }else if(date){
                    const _date = new Date(date);
                    match = {
                        ...match,
                        year : _date.getFullYear(), 
                    };
                    if(!match.yearOnly){
                        match.month = _date.getMonth() + 1;
                        if(!match.monthOnly) match.day = _date.getDate();
                    }
                    delete match.monthOnly; delete match.yearOnly;
                }
                console.log(match);
                const collection = client.collection(this.name);
                collection.aggregate([ 
                    {
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"},
                        },
                    },{
                        $match : match
                    },
                    { 
                        $group :  group ? group :
                        { 
                            _id : null, 
                            amount : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getDepositGroup";
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
    static getUserDepositsByDateRange(startDate, endDate, filter={}, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                if(!startDate) throw("No start date found");
                else if(!endDate) throw("No end date fount");
                const match = {
                    ...filter, $and : [
                    {actionDate : {$gte : myUtils.getStandardFromLocale(new Date(startDate).toLocaleDateString())} }, 
                    {actionDate : {$lte : myUtils.getStandardFromLocale(new Date(endDate).toLocaleDateString())} }, 
                ]}
                const collection = client.collection(this.name);
                collection.aggregate([ 
                    {
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"},
                        },
                    },{
                        $lookup : {
                            from : m_users.name,
                            localField : "by",
                            foreignField : "_id",
                            as : "user"
                        }
                    },{
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : "$user", 
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{  console.log(result);
                    if(err){
                        rej(err);
                        const error = errMsg + "getUserDepositsByDateRange";
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
    static getUserDepositsByDate(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = {year, month};
                if(day) match.day = day;
                client.collection(this.name).aggregate([ 
                    {
                        $addFields : {
                            year : {$year : "$actionDate"}, 
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}
                        }
                    },{
                        $lookup : {
                            from : m_users.name,
                            localField : "by",
                            foreignField : "_id",
                            as : "user"
                        }
                    },{
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : "$user", 
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getUserDepositsByDate";
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
    static deleteDeposit(depositId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(depositId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteDeposit";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                );
            });
        })
    }
    static getAllDeposits(filter, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDepositAggregateArray(filter)
                ).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getAllDeposits";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            });
        })
    }
    static getDeposits(filter, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDepositAggregateArray(filter)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getDeposits";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            });
        })
    }
    static getDepositMinMaxIds(filter, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getDepositAggregateArray(filter)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getDepositMinMaxIds";
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
        })
    }
    static searchDeposits(filter, keyword, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                filter = {
                    ...filter,
                    $or : [
                        {"patient.myProfile.lastName" : new RegExp(".*" + keyword + ".*", "i")},
                        {"patient.myProfile.firstName" : new RegExp(".*" + keyword + ".*", "i")},
                        {"_id" : keyword}
                    ]
                };
                client.collection(this.name).aggregate(
                    this.getDepositAggregateArray(filter)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchDeposits";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            });
        })
    }
    static getSearchDepositMinMaxIds(filter, keyword, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                filter = {
                    ...filter,
                    $or : [
                        {"patient.myProfile.lastName" : new RegExp(".*" + keyword + ".*", "i")},
                        {"patient.myProfile.firstName" : new RegExp(".*" + keyword + ".*", "i")},
                        {"_id" : keyword}
                    ]
                };
                client.collection(this.name).aggregate(
                    this.getDepositAggregateArray(filter)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getSearchDepositMinMaxIds";
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
        })
    }
    static getDepositAggregateArray(match){
        if(match.byAdmin) {
            delete match.userId; delete match.byAdmin;
        }
        const {startDate, endDate, date} = match;
        if(match.date){
            const _date = new Date(date);
            const _day = _date.getDate();
            const _month = _date.getMonth()+1;
            const _year = _date.getFullYear();
            match = match.monthOnly ? 
                {...match, _year, _month} : 
                {...match, _year, _month, _day}
        }else if (match.startDate){
            match = {...match, $and : [
                {actionDate : {$gte : Utils.getStandardFromLocale(new Date(match.startDate).toLocaleDateString())} }, 
                {actionDate : {$lte : Utils.getStandardFromLocale(new Date(match.endDate).toLocaleDateString())} }, 
            ]}
        }
        delete match.startDate; delete match.endDate; delete match.date; delete match.monthOnly
        if(match.detail) {
            delete match.detail;
            return [
                {
                    $addFields : {
                        _year : {$year : "$actionDate"},
                        _month : {$month : "$actionDate"},
                        _day : {$dayOfMonth : "$actionDate"}
                    }
                },{
                    $lookup : {
                        from : m_patients.name,
                        localField : "patientId",
                        foreignField : "_id",
                        as : "patient"
                    }
                },{
                    $unwind : {
                        path : "$patient",
                        preserveNullAndEmptyArrays : true
                    }
                },{
                    $match : match,
                }
            ]
        }else return [
            {
                $match : match
            }
        ]
    }
    static createDeposit(userId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, by : userId};
                data.actionDate = new Date(data.actionDate ? 
                    data.actionDate :
                    myUtils.getThisDate()
                );
                
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = new Error(errMsg + "createDeposit");
                            reject(error);
                            if(callback) callback(error);
                        }else {
                            res();
                            resolve(result.ops[0]);
                            if(callback) callback(err, result.ops[0]);
                        }
                    }
                )
            })
        })
    }
    static updateDepositQuery(query, update, options, many, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "updateDepositQuery";
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