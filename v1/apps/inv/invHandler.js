// const admin = require("./owners/admin");
const product = require("./owners/product");
const suppliers = require("./owners/suppliers");
const stocks = require("./owners/stocks");  
const prices = require('./owners/pricelist');
const pharm = require('./owners/pharm');
module.exports = function(req, res){
    console.log("param ===", req.params);
    console.log("query ====", req.query);
    console.log("body ===", req.body)
    if(req.query.companyId)
        req.query.companyId = parseInt(req.query.companyId);
    switch(req.params.owner){
        // case "0" : return admin(req, res);
        case "product" : return product(req, res);
        case "supplier" : return suppliers(req, res);
        case "stock" : return stocks(req, res);
        case "price" : return prices(req, res);
        case "pharm" : return pharm(req, res);
    }
}