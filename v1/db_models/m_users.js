const structure = require("../../Infrastructure/structure");
const utils = require("../../utils/Utils");
const bcrypt = require("bcryptjs");
let message = "DB Error! ";
module.exports = class users {
    static suspendUser(userId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne( 
                    {_id : userId},
                    {$set : {"myProfile.status" : "s"}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = message + "activateUser";
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
    static activateUser(userId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : userId},
                    {$set : {"myProfile.status" : "a"}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = message + "activateUser";
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
    static archiveUser(userId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : userId},
                    {$set : {"myProfile.archive" : true}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = message + "archiveUser";
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
    static getUsers(callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).find(
                    {
                        "myProfile.archive" : null, 
                        "myProfile.privilege" : {$ne : 0}
                    }).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = message + "getUsers";
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
    static getUser(_id, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne({_id}, (err, result)=>{
                    let message; 
                    if(err){
                        message = "Database error!";
                        rej(err);
                        reject(message);
                        if(callback) callback(message);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static updateProfile(_id, myProfile, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const {password} = myProfile;
                myProfile.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                client.collection(this.name).updateOne(
                    {_id}, {$set : {myProfile}}, (err, result)=>{
                        if(err){
                            rej(err);
                            reject(err);
                            if(callback) callback(err);
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
    static login(email, password, callback){
        return new Promise((pResolve, pReject)=>{
            structure.db.hms((client, resolve, reject)=>{
                let message;
                client.collection(this.name).findOne(
                    {$and : [
                        {$or : [{"myProfile.email" :email}, {"myProfile.userName" : email}]},
                        {"myProfile.archive" : null},
                        {$or : [{"myProfile.status" : "a"}, {"myProfile.status" : null}]}
                    ]},
                    (err, result)=>{
                        if(result) {
                            if(bcrypt.compareSync(password, result.myProfile.password)){
                                resolve();
                                pResolve(result);
                                if(callback) callback(result);
                            }else{
                                message = "Incorrect password";
                                reject(message);
                                pReject(message)
                                if(callback) callback(message);
                            }
                        }else{
                            message = "This email doesn't exist";
                            reject(message);
                            pReject(message);
                            if(callback) callback(message);
                        }
                    }
                )
            })
        })
    }
    static signup(data, callback){
        return new Promise((pResolve, pReject) => {
            structure.db.hms(async(client, resolve, reject) =>{
                data.registrationDate = new Date();
                data = {myProfile : data};
                const collection = client.collection(this.name);
                data._id =  await structure.db.autoIncrement(collection);
                const {password} = data.myProfile;
                data.myProfile.password = bcrypt.hashSync(password, 10);
                collection.insertOne(data, (err, result)=>{ 
                    if(err){
                        const message = "Error signin up, try again later!";
                        reject(err);
                        pReject(message);
                        if(callback) callback(message);
                    }else {
                        resolve();
                        pResolve(result.ops[0]);
                        if(callback) callback(err, result.ops[0]);
                    };
                })
            });
        })
    }
    static async usernameExists(username, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {"myProfile.userName" : username}, 
                    (err, result)=>{
                    if(err){
                        rej(err);
                        reject(err);
                        if(callback) callback(err)
                    }else { 
                        res();
                        if(result){
                            resolve(true);
                            if(callback) callback(err, true);
                        }else{
                            resolve(false);
                            if(callback) callback(err, false);
                        }
                    }
                })
            })
        });
    }
    static async emailExists(email, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne({"myProfile.email" : email}, (err, result)=>{ 
                    if(err){
                        rej(err);
                        reject(err);
                        if(callback) callback(err)
                    }else {
                        res();
                        if(result){
                            resolve(true);
                            if(callback) callback(err, true);
                        }else{
                            resolve(false);
                            if(callback) callback(err, false);
                        }
                    }
                })
            })
        });
    }
    static saveToken(userId, token, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : userId},
                    {$set : {
                        "myProfile.token" : token
                    }},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = message + "saveToken";
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
    static async generateToken(){
        const length = 30;
        let token = utils.token(length);
        try{
            while(await this.tokenExists(token)){
                token = utils.token(length);
            }
            return token;
        }catch(e){
            return null;
        }
    }
    static tokenExists(token, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne({"myProfile.token" : token}, (err, result)=>{
                    if(err){
                        rej(err);
                        reject(err);
                        if(callback) callback(err);
                    }else {
                        res();
                        resolve(result);
                        if(callback)callback(err, result);
                    }
                })
            })
        })
    }
    static getUserByToken(token, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    {"myProfile.token" : token},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = message + "getUserByToken";
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
    static getPropertyValue(filter, projection, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).findOne(
                    filter, {projection : projection}, (err, result)=>{
                    if(err){ 
                        rej(err);
                        let message = "DB error!";
                        reject(message);
                        if(callback) callback(message);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static updateUserQuery(query, update, options, many, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                const response = (err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "updateUserQuery";
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