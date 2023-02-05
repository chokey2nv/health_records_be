const posClient = require('./owners/posclient');
const dspCustomers = require("../dsp/owners/customers")
const dspSales = require('../dsp/owners/sales');
module.exports = function(req, res){
    console.log("param ===", req.params);
    console.log("query ====", req.query);
    console.log("body ===", req.body)
    if(req.query.companyId)
        req.query.companyId = parseInt(req.query.companyId);
    switch(req.params.owner){
        case "sales" : return dspSales(req, res);
        case "customers" : return dspCustomers(req, res);
        case "posClient" : return posClient(req, res);
    }

}