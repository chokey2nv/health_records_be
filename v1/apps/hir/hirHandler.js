const admin = require("./owners/admin");
const users = require("./owners/user");
module.exports = function(req, res){
    switch(req.params.owner){
        case "0" : return admin(req, res);
        case "1" : return users(req, res);
    }
}