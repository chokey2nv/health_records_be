const structure = require("../../../../Infrastructure/structure");
const m_drugNames = require('../../../db_models/inv/pharm/m_inv_drugnames');
const m_drugStrength = require('../../../db_models/inv/pharm/m_inv_drugstrength');
const m_drugDosageForm = require('../../../db_models/inv/pharm/m_inv_drugDosageForm');
const m_drugPacks = require('../../../db_models/inv/pharm/m_inv_drugpacks');
const m_drugs= require('../../../db_models/inv/pharm/m_inv_drugs');
const m_drugCategory = require('../../../db_models/inv/pharm/m_inv_drugCategory');
const appUtils = require('../../../../utils/Utils');
const success = "Success!";
const nullibles = ["undefined", "null"];
module.exports = class pricelist{
    async getDrugMinMaxIds(query, callback){
        let {companyId, sort} = query;
        if(nullibles.indexOf(sort) !== -1) sort = null;
        try{
            const result = {
                minMid : await m_drugs.getDrugMinMaxIds(companyId, sort),
                maxId : await m_drugs.getDrugMinMaxIds(companyId, sort, true)
            }
            callback({getDrugMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getDrugMinMaxIds : false, message});
        }
    }
    async getDrugs(query, body, callback){
        const {companyId} = query;
        const {rows, skip, sort, max} = body;
        try{
            const result = await m_drugs.getDrugs(companyId, rows, skip, sort, max);
            callback({getDrugs : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getDrugs : false, message});
        }
    }
    async createDrug(query, body, callback){
        const {companyId} = query;
        const {nameStrengths, dosageForm, pack, category} = body;
        const record = { nameStrengths : []};
        try{
            if(nameStrengths) for (let i = 0; i < nameStrengths.length; i++) {
                const {name, strength} = nameStrengths[i];
                let strengthId; 
                if(strength){
                    if(strength._id) strengthId = structure.db.ObjectId(strength._id) ;
                    else {
                        const existingStrength = await m_drugStrength.getDrugStrengthByName(strength.name);
                        if(existingStrength) strengthId = existingStrength._id;
                        else strengthId = (await m_drugStrength.createDrugStrength(strength))._id
                    }
                }
                let ns_info = {
                    nameId : name._id ? structure.db.ObjectId(name._id) : (await m_drugNames.createDrugName(name))._id,
                }
                if(strengthId) ns_info = {...ns_info, strengthId};
                record.nameStrengths.push(ns_info);
            }
            if(dosageForm){
                if(dosageForm._id){
                    record.dosageFormId = structure.db.ObjectId(dosageForm._id);
                }else{
                    const existingDosageForm = await m_drugDosageForm.getDrugDosageByName(dosageForm.name);
                    if(existingDosageForm) record.dosageFormId = existingDosageForm._id;
                    else record.dosageFormId = (await m_drugDosageForm.createDrugDosage(dosageForm))._id
                }
            }
            if(pack) 
                if(pack._id) record.packId = structure.db.ObjectId(pack._id)
                else{
                    const existingPack = await m_drugPacks.getDrugPackByName(pack.name);
                    if(existingPack) record.packId = existingPack._id;
                    else record.packId = (await m_drugPacks.createDrugPack(pack))._id;
                }
            if(await m_drugs.drugExists(record))
                throw("Drug already exist in database")
            const result = await m_drugs.createDrug(companyId, record);
            if(category._id) {
                await m_drugCategory.addCategoryMember(category._id, result._id);
                await m_drugs.addDrugCatogoryId(result._id, structure.db.ObjectId(category._id));
            }else {
                const newCategory = await m_drugCategory.createDrugCategory(category);
                await m_drugCategory.addCategoryMember(newCategory._id, result._id);
                await m_drugs.addDrugCatogoryId(result._id, newCategory._id);
            }
            callback({createDrug : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createDrug :false, message});
        }
    }
    async searchDrugNameProperty(query, callback){
        let {name, keyword} = query;
        keyword = appUtils.escapeRegExp(keyword);
        try{
            let result = null;
            switch(name){
                case "name" : result = await m_drugNames.searchDrugName(keyword); 
                    break;
                case "strength" : result = await m_drugStrength.searchDrugStrength(keyword);
                    break;
                case "dosageForm" : result = await m_drugDosageForm.searchDosageForm(keyword);
                    break;
                case "pack" : result = await m_drugPacks.searchDrugPack(keyword);
                    break;
                case "category" : result = await m_drugCategory.searchDrugCategory(keyword);
                    break;
            }
            console.error("result **********", result);
            if(callback) callback({searchDrugNameProperty : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchDrugNameProperty : false, message});
        }
    }
}