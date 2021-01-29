const structure = require("../../Infrastructure/structure");
const m_users = require("./m_users");
const m_patients = require("./m_patients");
let errMsg = "DB Error! ";
module.exports = class appointments {

    static getMultiplePatientYearlyAppointments(patientIds, year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientYearlyAppointments";
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
                        visit : 1,
                        year : {$year : "$actionDate"},
                        month : {$month : "$actionDate"}
                    }},{
                        $match : {
                            patientId : {$in : patientIds}, year, visit : true
                        }
                    },{
                        $group : {
                            _id : {patientId : "$patientId", year : "$year", month : "$month"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({actionDate : 1}).toArray(response);
            });
        });
    }
    static getPatientYearlyAppointments(patientId, year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPatientYearlyAppointments";
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
                        visit : 1,
                        year : {$year : "$actionDate"},
                        month : {$month : "$actionDate"}
                    }},{
                        $match : {
                            patientId, year, visit : true
                        }
                    },{
                        $group : {
                            _id : {year : "$year", month : "$month"},
                            count : {$sum : 1}
                        }
                    }
                ]).sort({actionDate : 1}).toArray(response);
            });
        });
    }
    static deleteAppointment(appointId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(appointId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteAppointment";
                            reject(error);
                            if(callback) callback(error)
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
    static getRecentVisitedPatientByDate(year, month, day, limit, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const match = {year, month, visit : true};
                if(day) match.day = day;
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getRecentVisitedPatientIdByDate";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"},
                            visit : 1,
                            patientId : 1
                        }
                    },{
                        $lookup : {
                            from : m_patients.name,
                            localField : "patientId",
                            foreignField : "_id",
                            as : "patient",
                        }
                    },{
                        $match : match
                    }
                ]).sort({_id : 1})
                .limit(limit)
                .map(item=>item.patient && item.patient[0]).toArray(response);
            })
        })
    }
    static getAppointmentDayTotalCount(year, month, day, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentDayTotalCount";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"},
                            visit : 1,
                        }
                    },{
                        $match : {year, month, day, visit : true}
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
    static getAppointmentMonthTotalCount(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointmentMonthTotalCount";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            visit : 1,
                        }
                    },{
                        $match : {year, month, visit : true}
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
    static getAppointmentYearTotalCount(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointmentYearTotalCount";
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
                            year : {$year : "$date"},
                            visit : 1,
                        }
                    },{
                        $match : {year, visit : true}
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
    static getActualAppointmentMonthDayData(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointmentMonthDayData";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"},
                            visit : 1
                        }
                    },{
                        $match : {year, month, visit : true}
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
    static getActualAppointmentYearMonthData(year, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getActualAppointmentYearMonthData";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"}, 
                            visit : 1,
                        }
                    },{
                        $match : {year, visit : true}
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
    static getAppointmentMonthDayData(year, month, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => { 
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointmentMonthDayData";
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
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"}
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
    static getAppointmentYearMonthData(year, callback){
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
                        $project : {
                            _id : 1, 
                            year : {$year : "$date"},
                            month : {$month : "$date"}
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
    static getAnAppointment(appointId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAnAppointment";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result ? result[0] : null);
                        if(callback)callback(err, result ? result[0] : null);
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
                        $unwind : "$patient"
                    },{
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            visit : 1, approvedBy : 1,
                        }
                    },{
                        $match : {_id : structure.db.ObjectId(appointId)}
                    },
                ]).toArray(response);
            });
        })
    }
    static unApproveAppointment(userId, appointId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(appointId)},
                    {$set : {visit : null, approvedBy : userId}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "unApproveAppointment";
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
    static approveAppointment(userId, appointId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(appointId)},
                    {$set : {visit : true, approvedBy : userId}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "approveAppointment";
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
    static bookAppointment(userId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data.by = userId;
                data.date = new Date(data.date);
                data.actionDate = new Date();
                client.collection(this.name).insertOne(data, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "bookAppointment";
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
    static getPatientAppointments(patientId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {patientId}
                ).sort({_id : -1}).toArray((err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "getPatientAppointments";
                            reject(error);
                            if(callback)callback(error);
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
    static searchAppointments(keyword, callback){
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
                    //this is string
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
                                unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            }
                        },{
                            $match : {name : {"$regex" : reValue}}
                        },
                    ]).toArray(response);
                }else{
                    //this is number
                    keyword = parseInt(keyword)
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
                                unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                                staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                                visit : 1, approvedBy : 1,
                            }
                        },{
                            $match : {patientId : {$in : [keyword]}}
                        },
                    ]).toArray(response);
                }
            })
        })
    }
    static searchAppointmentsByDate(date, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "searchAppointmentsByDate";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                date = new Date(date);
                client.collection(this.name).aggregate([
                    {
                        $project : {
                            _id : 1, unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            visit : 1, approvedBy : 1,
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"}
                        }
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
                        $match : {
                            year : date.getFullYear(),
                            month : date.getMonth() + 1,
                            day : date.getDate()
                        }
                    },{
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            visit : 1, approvedBy : 1,
                        }
                    }
                ]).sort({date : -1}).toArray(response);
            })
        })
    }
    static getTodayAppointments(callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointments";
                        reject(error);
                        if(callback) callback(error);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }                    
                }
                const date = new Date();
                collection.aggregate([
                    {
                        $project : {
                            _id : 1, unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            visit : 1, approvedBy : 1,
                            year : {$year : "$date"},
                            month : {$month : "$date"},
                            day : {$dayOfMonth : "$date"}
                        }
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
                        $match : {
                            year : date.getFullYear(), 
                            month : date.getMonth() + 1,
                            day : date.getDate()
                        }
                    },{
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            visit : 1, approvedBy : 1,
                        }
                    }
                ]).sort({date : -1}).toArray(response);
            })
        })
    }
    static getAppointments(lastId, rows, skip, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const collection = client.collection(this.name);
                const response = (err, result) => {
                    if(err){
                        rej(err);
                        const error = errMsg + "getAppointments";
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
                        $unwind : "$patient"
                    },{
                        $project : {
                            _id : 1,
                            name : {$concat : ["$patient.myProfile.firstName", " ", "$patient.myProfile.lastName"]},
                            unit : 1, date : 1, patientId : 1, by : 1, actionDate : 1,
                            staff : {$concat : ["$staff.myProfile.firstName", " ", "$staff.myProfile.lastName"]},
                            visit : 1, approvedBy : 1,
                        }
                    }
                ]).sort({_id : -1}).skip(skip).limit(rows).toArray(response);
            })
        })
    }
    static getMaxId(sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find()
                .sort(sort ? {sort : -1 } : {date: -1})
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
                .sort(sort ? {sort : 1 } : {date: 1})
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
}