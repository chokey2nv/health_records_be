let v1Handler = require('./v1/v1Handler');
module.exports = function(req, res){
    console.log("version name = " + req.params.version);
    switch (req.params.version) {
        case "v1" : v1Handler(req, res); break;
    }
}