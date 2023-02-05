const structure = require('../../../../Infrastructure/structure');
const m_patients = require('../../m_patients');
const m_payments = require('../../m_payments');
const dspUtils = require("../../../../utils/Utils");
const errMsg = "DB Error - ";
module.exports = class product_salelists{
    static getSearchSalelistMinMaxIds(match, type, keyword, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                match = {...match, $or : [{
                    description : new RegExp(".*"+keyword+".*", "i"),
                    "customer.myProfile.lastName" : new RegExp(".*" + keyword +".*", "i"),
                    "customer.myProfile.firstName" : new RegExp(".*"+keyword+".*", "i"),
                }]};
                if(type === "paid") match.paymentId = {$exists : true};
                else if(type === "unpaid") match.paymentId = {$exists : false};
                client.collection(this.name).aggregate(
                    this.getSalelistsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getSearchSalelistMinMaxIds";
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
                })
            })
        })
    }
    static searchSalelists(match, type, keyword, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                match = {...match, $or : [{
                    description : new RegExp(".*"+keyword+".*", "i"),
                    "customer.myProfile.lastName" : new RegExp(".*"+keyword+".*", "i"),
                    "customer.myProfile.firstName" : new RegExp(".*"+keyword+".*", "i"),
                }]};
                if(type === "paid") match.paymentId = {$exists : true};
                else if(type === "unpaid") match.paymentId = {$exists : false};
                client.collection(this.name).aggregate(
                    this.getSalelistsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchSalelists";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            });
        });
    }
    static getSalelistMinMaxIds(match, type, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                if(type === "paid") match.paymentId = {$exists : true};
                else if(type === "unpaid") match.paymentId = {$exists : false};
                client.collection(this.name).aggregate(
                    this.getSalelistsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getSalelistMinMaxIds";
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
                })
            })
        })
    }
    static getSalelists(match, type, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                if(type === "paid") match.paymentId = {$exists : true};
                else if(type === "unpaid") match.paymentId = {$exists : false};
                client.collection(this.name).aggregate(
                    this.getSalelistsAggregateArray(match)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getSalelists";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            });
        });
    }
    static getSalelistsAggregateArray(match){
        if(match && match.startDate){
            match = {...match, $and : [
                {actionDate : {$gte : dspUtils.getStandardFromLocale(new Date(match.startDate).toLocaleDateString())} }, 
                {actionDate : {$lte : dspUtils.getStandardFromLocale(new Date(match.endDate).toLocaleDateString())} }, 
            ]}
            delete match.startDate;
            delete match.endDate;
        }
        return [
            {
                $project : {
                    _id : 1, totalPrice : 1, useAccount : 1, customerId : 1,
                    companyId : 1, by : 1, paymentId : 1, products : 1, actionDate : 1,
                    saleIds : 1, 
                    day : {$dayOfMonth : "$actionDate"},
                    month : {$month : "$actionDate"},
                    year : {$year : "$actionDate"},                    
                }
            },{
                $lookup : {
                    from : m_payments.name,
                    localField : "paymentId",
                    foreignField : "_id",
                    as : "payment",
                }
            },{
                $unwind : {
                    path : "$payment",
                    preserveNullAndEmptyArrays : true,
                }
            },{
                $lookup : {
                    from : m_patients.name,
                    localField : "customerId",
                    foreignField : "_id",
                    as : "customer"
                }
            },{
                $unwind : {
                    path : "$customer",
                    preserveNullAndEmptyArrays : true,
                }
            },{
                $match : match
            }
        ]
    }
    static createSaleList(companyId, userId, list, callback){
        list = {
            ...list, companyId, by : userId, 
            actionDate : new Date(dspUtils.getThisDate())
        };
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertOne(
                    list, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createSaleList";
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
    static updateSalelistWitQuery(listId, update, option, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(listId)},
                    update, option,
                    (err, result) => {
                        if(err){
                            rej(err);
                            const error = errMsg + "updateSalelistWitQuery";
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
}