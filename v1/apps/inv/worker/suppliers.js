const m_suppliers = require("../../../db_models/m_inv_suppliers");
const m_brands = require("../../../db_models/m_inv_product_brands");
const success = "Success!";
module.exports = class suppliers{
    async searchSupplierMinMaxId(query, callback){
        const {keyword, companyId} = query;
        try{
            const minId = await m_suppliers.searchSupplierMinMaxId(companyId, keyword);
            const maxId = await m_suppliers.searchSupplierMinMaxId(companyId, keyword, true);
            callback({searchSupplierMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({searchSupplierMinMaxId : false, message});
        }
    }
    async searchSuppliers(query, body, callback){
        const {companyId} = query;
        const {keyword, rows, skip} = body;
        try{
            const result = await m_suppliers.searchSuppliers(companyId, keyword, rows, skip);
            callback({searchSuppliers : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchSuppliers : false, message});
        }
    }
    async getSuppliers(query, callback){
        try{
            const companyId = query.companyId;
            const rows = parseInt(query.rows);
            const skip = parseInt(query.skip);
            const result = m_suppliers.getSuppliers(companyId, rows, skip);
            callback({getSuppliers : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSuppliers : false, message});
        }
    }
    async createSupplier(query, body, callback){
        const {companyId} = query;
        try{
            if(await m_suppliers.supplierNameExist(body.name))
                throw("Company name already exists")
            const result = await m_suppliers.createSupplier(companyId, body);
            callback({createSupplier : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createSupplier : false, message});
        }
    }
}
