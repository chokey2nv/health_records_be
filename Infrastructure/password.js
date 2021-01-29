var bcrypt = require('bcryptjs');

exports.hashPassword = function(password, callback){
    bcrypt.genSalt(10, function(err, salt){
        if(err){
            if(callback) callback(err);
            return {err};
        }
        bcrypt.hash(password, salt, function(err, hash){
            if(callback) callback(err, hash);
            return {err, hash};
        })
    })
}

exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch){
        return err == null ? callback(null, isMatch) : callback(err);
    })
}