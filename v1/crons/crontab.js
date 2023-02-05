const backup = require('./scripts/backup');

module.exports = [
    {
        name : "expire_subs", 
        schedule : "* 0 18 * * * *", 
        command : backup
    }
]