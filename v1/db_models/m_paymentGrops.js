const structure = require("../../Infrastructure/structure");
const m_payments = require("./m_payments")
const m_users = require("./m_users");
let errMsg = "DB Error! ";
module.exports = class paymentgroups {
    static deletePaymentFromGroup(groupId, paymentId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(groupId)},
                    {$pull : {paymentIds : structure.db.ObjectId(paymentId)}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deletePaymentFromGroup";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(result.result);
                        }
                    }
                )
            })
        })
    }
    static deleteGroup(groupId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(groupId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteGroup";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(result.result);
                        }
                    }
                )
            })
        })
    }
    static getPaymentGroup(groupId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $lookup : {
                            from : m_payments.name,
                            localField : "paymentIds",
                            foreignField : "_id",
                            as : "paymentList"
                        },
                    },{
                        $match : {_id : structure.db.ObjectId(groupId)}
                    }
                ]).map(item=>item.paymentList).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getPaymentGroup";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result ? result[0] : []);
                        if(callback)callback(err, result ? result[0] : []);
                    }
                });
            })
        })
    }
    static createPaymentGroup(paymentIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).insertOne(paymentIds, (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "createPaymentgroup";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result.ops[0]);
                        if(callback) callback(err, result.ops[0])
                    }
                })
            })
        })
    }
}