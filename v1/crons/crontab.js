const path = require('path');
module.exports = [
    {
        name : "expire_subs", 
        schedule : "0 0 0 * * *", 
        command : "node " + path.join(__dirname, "scripts", "backup.bat")
    }
]