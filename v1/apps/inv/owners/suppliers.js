const supplier = require("../worker/suppliers");
const suplierWorker = new supplier();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION", action);
    switch(action){       
        
        case "searchSupplierMinMaxId" : 
            return suplierWorker.searchSupplierMinMaxId(req.query, result=>res.send(result));
        case "searchSuppliers" :
            return suplierWorker.searchSuppliers(req.query, req.body, result=>res.send(result));
        case "getSuppliers" : 
            return suplierWorker.getSuppliers(req.query, result=>res.send(result));
        case "createSupplier" :
            return suplierWorker.createSupplier(req.query, req.body, result=>res.send(result));
    }
}