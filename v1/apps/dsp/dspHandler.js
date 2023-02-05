const dspSettings = require('./owners/settings');
const dspCustomers = require('./owners/customers');
const dspSales = require("./owners/sales");
module.exports = function(req, res){
    console.log("param ===", req.params);
    console.log("query ====", req.query);
    console.log("body ===", req.body)
    if(req.query.companyId)
        req.query.companyId = parseInt(req.query.companyId);
    switch(req.params.owner){
        case "sales" : return dspSales(req, res);
        case "settings" : return dspSettings(req, res);
        case "customers" : return dspCustomers(req, res);
    }

}