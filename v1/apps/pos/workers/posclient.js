const success = "Success!";
const structure = require('../../../../Infrastructure/structure');
const m_products = require("../../../db_models/m_inv_products");
const m_packages = require('../../../db_models/m_inv_productPackages');
const m_prices = require('../../../db_models/inv/pricelist/m_inv_prices');
const m_payment = require('../../../db_models/m_payments');
const m_sales = require('../../../db_models/dsp/sales/m_sales');
const m_salelist = require('../../../db_models/dsp/sales/m_salelists');
const nullibles = ["undefined", "null"];
module.exports = class posClient{
    async getProductsByIds(query, body, callback){
        const {productIds} = body;
        try{
            const result = await m_products.getProductsByIds(productIds);
            callback({getProductsByIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductsByIds : false, message});
        }
    }
    async dispensePaidSell(query, body, callback){
        const {companyId, userId} = query;
        try{
            const addedSales = await m_sales.createSale(companyId, userId, body.products)
            const saleIds = addedSales.map(item=>item._id);
            await m_salelist.updateSalelistWitQuery(body._id, {
                $set : { saleIds },
                $unset : {products : 1}
            }, {
                upsert : true
            });
            let result;
            if(saleIds) result = await m_sales.updateSales(
                saleIds, {groupId : structure.db.ObjectId(body._id)}
            );
            callback({dispensePaidSell : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({dispensePaidSell : false, message});
        }
    }
    async createSale(query, body, callback) {
        const {companyId, userId} = query;
        const {sale, payment} = body;
        try{
            if(payment){
                const addedPayment = await m_payment._postPayment(companyId, userId, payment);
                sale.paymentId = addedPayment._id;
                const saleProducts = await m_sales.createSale(companyId, userId, sale.products);
                delete sale.products;
                sale.saleIds = saleProducts && saleProducts.map(item=>item._id)
            }
            const result = await m_salelist.createSaleList(companyId, userId, sale);
            if(sale.saleIds) await m_sales.updateSales(sale.saleIds, {groupId : result._id});
            callback({createSale : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createSale : false, message});
        }
    }
    
    async getPricesByProductIds(query, body, callback) {
        const {productIds} = body;
        try{
            const result = await m_prices.getPricesByProductIds(productIds);
            callback({getPricesByProductIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPricesByProductIds : false, message});
        }
    }
    async getProductPackages(query, callback){
        const {companyId} = query;
        try{
            const result = await m_packages.getProductPackages(companyId);
            callback({getProductPackages : true, result , message : success});
        }catch(message){
            console.error(message);
            callback({getProductPackages : false, message});
        }
    }
    async getStockProductMinMaxId(query, callback){
        let {companyId, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductMinMaxId(companyId, null, sort, true,);
            const maxId = await m_products.getStockProductMinMaxId(companyId, true, sort, true);
            callback({getStockProductMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductMinMaxId : false, message});
        }
    }
    async getStockProductSearchMinMaxId(query, callback){
        let {companyId, sort, keyword} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductSearchMinMaxId(companyId, keyword, null, sort, true);
            const maxId = await m_products.getStockProductSearchMinMaxId(companyId, keyword, true, sort, true);
            callback({getStockProductSearchMinMaxId : true, result: {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductSearchMinMaxId : false, message});
        }
    }
    async searchStockProducts(query, body, callback){
        const {companyId} = query;
        const {keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_products.searchStockProducts(companyId, keyword, rows, skip, sort, max, true);
            callback({searchStockProducts : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({searchStockProducts : false, message});
        }
    }
    async getStockProducts(query, body, callback){
        const {rows, skip, sort, max} = body;
        const {companyId} = query;
        try{
            const result = await m_products.getStockProducts(companyId, rows, skip, sort, max, true);
            callback({getStockProducts : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProducts : false, message});
        }
    }
}