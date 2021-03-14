const structure = require("../../Infrastructure/structure");
const m_patients = require("./m_patients")
const m_users = require("./m_users");
const myUtils = require("../../utils/Utils");
const Utils = require("../../utils/Utils");
let errMsg = "DB Error! ";
module.exports = class payments {
    static getMultiplePatientYearlyPayments(patientIds, year, callback){ 
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getMultiplePatientYearlyPayments";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                };
                collection.aggregate([
                    {$project : {
                        patientId : 1,
                        amount : 1,
                        year : {$year : "$actionDate"},
                        month : {$month : "$actionDate"}
                    }},{
                        $match : {
                            patientId : {$in : patientIds}, year,
                        }
                    },{
                        $group : {
                            _id : {patientId : "$patientId", year : "$year", month : "$month"},
                            total : {$sum : "$amount"}
                        }
                    }
                ]).sort({actionDate : 1}).toArray(response);
            });
        });
    }
    static getPatientYearlyPayments(patientId, year, callback){ 
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientYearlyPayments";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                };
                collection.aggregate([
                    {$project : {
                        patientId : 1,
                        amount : 1,
                        year : {$year : "$actionDate"},
                        month : {$month : "$actionDate"}
                    }},{
                        $match : {
                            patientId, year,
                        }
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month"},
                            total : {$sum : "$amount"}
                        }
                    }
                ]).sort({actionDate : 1}).toArray(response);
            });
        });
    }
    static getAPayment(paymentId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {_id : structure.db.ObjectId(paymentId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getAPayment";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result);
                            if(callback)callback(err, result);
                        }
                    }
                )
            })
        })
    }
    static updatePayment(paymentId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(paymentId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updatePayment";
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
    static deletePayment(paymentId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(paymentId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deletePayment";
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
    static getPaymentDayTotalAmount(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentDayTotalAmount";
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
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}
                        }
                    },{
                        $match : {year, month, day}
                    },{
                        $group : {
                            _id : {accountAction : "$accountAction", year : "$year", month : "$month", day : "$day"},
                            amount : {$sum : "$amount"}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPaymentMonthTotalAmount(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentMonthTotalAmount";
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
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"}
                        }
                    },{
                        $match : {year, month}
                    },{
                        $group : {
                            _id : {accountAction : "$accountAction", year : "$year", month : "$month"},
                            amount : {$sum : "$amount"}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPaymentYearTotalAmount(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentYearTotalAmount";
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
                        $addFields : {
                            year : {$year : "$actionDate"},
                        }
                    },{
                        $match : {year}
                    },{
                        $group : {
                            _id :  {accountAction : "$accountAction", year : "$year"},
                            amount : {$sum : "$amount"}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPaymentYearMonthData(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentYearMonthData";
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
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"}
                        }
                    },{
                        $match : {year}
                    },{
                        $group : {
                            _id : {accountAction : "$accountAction", year : "$year", month : "$month"},
                            amount : {$sum : "$amount"}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static getPaymentMonthDayData(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentMonthDayData";
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
                        $addFields : {
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"},
                        }
                    },{
                        $match : {year, month}
                    },{
                        $group : {
                            _id : {accountAction : "$accountAction", year : "$year", month : "$month", day : "$day"},
                            amount : {$sum : "$amount"}
                        }
                    }
                ]).sort({_id : 1}).toArray(response);
            })
        });
    }
    static searchPaymentsByPatient(keyword, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPaymentsByPatient";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                if(isNaN(Number(keyword))){
                    //it is string
                    const reValue = new RegExp(".*"+keyword+".*", "i");
                    collection.aggregate([
                        {
                            $lookup : {
                                from : m_patients.name,
                                localField : "patientId",
                                foreignField : "_id",
                                as : "patient"
                            }
                        },{
                            $unwind : "$patient"
                        },{
                            $project : {
                                _id : 1, 
                                name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                                amount : 1, revenueType : 1, groupId : 1,  patientId : 1, by : 1, actionDate : 1,
                                accountAction : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            }
                        },{
                            $match : {name : {"$regex" : reValue}}
                        }
                    ]).sort({_id : -1}).toArray(response);
                }else{
                    keyword = parseInt(keyword);
                    collection.aggregate([
                        {
                            $lookup : {
                                from : m_patients.name,
                                localField : "patientId",
                                foreignField : "_id",
                                as : "patient"
                            }
                        },{
                            $unwind : "$patient"
                        },{
                            $project : {
                                _id : 1,
                                name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                                amount : 1, revenueType : 1, groupId : 1, patientId : 1, by : 1, actionDate : 1,
                                accountAction : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            }
                        },{
                            $match : {patientId : keyword}
                        }
                    ]).sort({_id : -1}).toArray(response);
                }
            });
        });
    }
    static searchPaymentsByDateRange(startDate, endDate, filter={}, callback){ 
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPaymentsByDateRange";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
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
                        $lookup : {
                            from : m_users.name,
                            localField : "by",
                            foreignField : "_id",
                            as : "staff"
                        }
                    },{
                        $unwind : {
                            path : "$staff",
                            preserveNullAndEmptyArrays : true
                        }
                    },{
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            amount : 1, revenueType : 1, groupId : 1, patientId : 1, by : 1, actionDate : 1, description : 1,
                            accountAction : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                        }
                    },{
                        $match : match
                    }
                ]).sort({_id : -1}).toArray(response);
            });
        });
    }
    static searchPaymentsByDate(year, month, day, callback){ 
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = {year, month};
                if(day) match.day = day;
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "searchPaymentsByDate";
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
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            amount : 1, revenueType : 1, groupId : 1, patientId : 1, by : 1, actionDate : 1, description : 1,
                            accountAction : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            year : {$year : "$actionDate"},
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}

                        }
                    },{
                        $match : match
                    }
                ]).sort({_id : -1}).toArray(response);
            });
        });
    }
    /**
     * if(match.startDate){
            match = {
                ...match, $and : [
                {date : {$gte : Utils.getStandardFromLocale(new Date(match.startDate).toLocaleDateString())} }, 
                {date : {$lte : Utils.getStandardFromLocale(new Date(match.endDate).toLocaleDateString())} }, 
            ]}
            delete match.startDate; delete match.endDate;
        }
     */
    static getPaymentByUserIdAndDate(data, callback){
        const {userId : by, year, month, day, startDate, endDate} = data;
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                let match = {by};
                if(startDate){
                    match = {
                        ...match, $and : [
                        {actionDate : {$gte : Utils.getStandardFromLocale(new Date(startDate).toLocaleDateString())} }, 
                        {actionDate : {$lte : Utils.getStandardFromLocale(new Date(endDate).toLocaleDateString())} }, 
                    ]}
                    delete match.startDate; delete match.endDate;
                }else{
                    match = {year, month, by};
                    if(day) match.day = day;
                }
                client.collection(this.name).aggregate([ 
                    {
                        $addFields :{
                            year : {$year : "$actionDate"}, 
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}
                        }
                    },{
                        $lookup : {
                            from : m_patients.name,
                            localField : "patientId",
                            foreignField : "_id",
                            as : "patient"
                        }
                    },{
                        $match : match
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentByUserIdAndDate";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
            });
        });
    }
    static getUserPaymentsByDateRange(startDate, endDate, filter={}, callback){
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
                        $unwind : {
                            path : "$user",
                            preserveNullAndEmptyArrays : true
                        }
                    },{
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : {user : "$user", accountAction : "$accountAction"}, 
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getUserPaymentsByDateRange";
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
    static getUserPaymentsByDate(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = {year, month};
                if(day) match.day = day;
                client.collection(this.name).aggregate([ 
                    {
                        $addFields : 
                        {
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
                        $unwind : {
                            path : "$user",
                            preserveNullAndEmptyArrays : true
                        }
                    },{
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : {accountAction : "$accountAction", user : "$user"}, 
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getUserPaymentsByDate";
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
    static getPaymentByRevenueTypeAndDate(data, callback){
        const {revenueName : revenueType, year, month, day, startDate, endDate} = data;
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                let match = {revenueType};
                if(startDate){
                    match = {
                        ...match, $and : [
                        {actionDate : {$gte : Utils.getStandardFromLocale(new Date(startDate).toLocaleDateString())} }, 
                        {actionDate : {$lte : Utils.getStandardFromLocale(new Date(endDate).toLocaleDateString())} }, 
                    ]}
                    delete match.startDate; delete match.endDate;
                }else {
                    match = {...match, year, month, revenueType};
                    if(day) match.day = day;
                }
                client.collection(this.name).aggregate([ 
                    {
                        $addFields :{
                            year : {$year : "$actionDate"}, 
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}
                        }
                    },{
                        $lookup : {
                            from : m_patients.name,
                            localField : "patientId",
                            foreignField : "_id",
                            as : "patient"
                        }
                    },{
                        $match : match
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentByRevenueTypeAndDate";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
            });
        });
    }
    static getRevenuePaymentsByDateRange(startDate, endDate, filter={}, callback){
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
                    }, 
                    {
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : {revenueType : "$revenueType", accountAction : "$accountAction"},
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getRevenuePaymentsByDateRange";
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
    static getRevenuePaymentsByDate(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const match = {year, month};
                if(day) match.day = day;
                client.collection(this.name).aggregate([ 
                    {
                        $project : 
                        {
                            revenueType : 1, groupId : 1,
                            amount : 1, accountAction : "$accountAction",
                            year : {$year : "$actionDate"}, 
                            month : {$month : "$actionDate"},
                            day : {$dayOfMonth : "$actionDate"}
                        }
                    }, 
                    {
                        $match : match
                    },
                    { 
                        $group :  
                        { 
                            _id : {revenueType :"$revenueType", accountAction : "$accountAction" }, 
                            total : {$sum : "$amount"}, 
                        } 
                    }
                ]).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getRevenuePaymentsByDate";
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
    static getPayments(lastId, rows, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPayments";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }
                }
                if(lastId){
                    collection.aggregate([
                        {
                            $match : {_id : {$lt : lastId}}
                        },{
                            $lookup : {
                                from : m_patients.name,
                                localField : "patientId",
                                foreignField : "_id",
                                as : "patient"
                            }
                        },{
                            $unwind : "$patient"
                        },{
                            $project : {
                                _id : 1,
                                name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                                amount : 1, revenueType: 1, groupId : 1, patientId : 1, by : 1, actionDate : 1, description : 1,
                                accountAction : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            }
                        }
                    ]).sort({date : -1}).limit(rows).toArray(response);
                }else{
                    collection.aggregate([
                        {
                            $lookup : {
                                from : m_patients.name,
                                localField : "patientId",
                                foreignField : "_id",
                                as : "patient"
                            }
                        },{
                            $unwind : "$patient"
                        },{
                            $project : {
                                _id : 1,
                                name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                                amount : 1, revenueType : 1, groupId : 1, patientId : 1, by : 1, actionDate : 1, description : 1,
                                accountAction : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            }
                        }
                    ]).sort({date : -1}).limit(rows).toArray(response);
                }
            })
        })
    }
    static getPatientPayments(patientId, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {patientId}
                ).sort({_id : -1}).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientPayments";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static updatePaymentGroupsToPayments(paymentIds, groupId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateMany(
                    {_id : {$in : paymentIds}},
                    {$set : {groupId}},
                    {upsert : true, multi : true},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updatePaymentGroupsToPayments";
                            reject(error);
                            if(callback)callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback)callback(result.result);
                        }
                    }
                )
            })
        })
    }
    static _postPayment(companyId, userId, payment, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                payment.by = userId;
                payment.companyId = companyId;
                payment.actionDate = new Date(myUtils.getThisDate());
                client.collection(this.name).insertOne(
                    payment, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "postPayment";
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
    static postPayment(userId, payment, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                payment.by =userId;
                payment.actionDate = new Date(payment.actionDate ? 
                    payment.actionDate :
                    myUtils.getThisDate()
                );
                
                client.collection(this.name).insertOne(
                    payment, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "postPayment";
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
}