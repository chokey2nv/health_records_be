const hirWorker = require("../apps/hir/workers/hir_woker");

module.exports = function createDefaultAdminUser(){
    new hirWorker().createUser(
        {userId : 0},
        {
            email : "admin@hms.com",
            userName : "admin",
            password : "12345678",
            privilege : "admin"
        },
        (response)=>{
            console.log({response});
        }
    )
}