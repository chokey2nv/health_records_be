const _customerWorker = require('../workers/customers');
const customerWorker = new _customerWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION === ", action);
    switch(action){
        case "getCustomers" :
            return customerWorker.getCustomers(req.query, req.body, result=>res.send(result));
        case "getCustomerMinMaxIds" :
            return customerWorker.getCustomerMinMaxIds(req.query, result=>res.send(result));
        case "searchCustomers" :
            return customerWorker.searchCustomers(req.query, req.body, result=>res.send(result));
        case "getSearchCustomerMinMaxIds" :
            return customerWorker.getSearchCustomerMinMaxIds(req.query, result=>res.send(result));
    }
}