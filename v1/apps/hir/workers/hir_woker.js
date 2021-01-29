const m_users = require("../../../db_models/m_users");
const m_settings = require("../../../db_models/m_settings");
const m_patients = require("../../../db_models/m_patients");
const m_appointments = require("../../../db_models/m_appointments");
const m_payments = require("../../../db_models/m_payments");
const m_deposits = require("../../../db_models/m_deposits");
const m_paymentgroup = require("../../../db_models/m_paymentGrops");
const m_families = require("../../../db_models/m_families");
const structure = require('../../../../Infrastructure/structure');
const Utils = require("../../../../utils/Utils");
const success = "Success!";
module.exports = class hirWorker {
    static async verifyToken(query, callback){
        const {userId, token } = query;
        try{
            const user = await m_users.getUserByToken(token);
            if(user){
                if(user._id === userId){
                    if(callback) callback(true);
                    return true;
                }else console.error("User - token mismatch");
            }else console.error("Invalid Authentication");
        }catch(message){
            console.error(message);
        }
        if(callback) callback(false);
        return false;
    }
    async updateDeposit(query, body, callback){
        const {userId} = query,
        {depositId, data} = body
        try{
            data.actionDate = new Date(data.actionDate ? 
                data.actionDate :
                Utils.getThisDate()
            );
            const result = await m_deposits.updateDepositQuery(
                {_id : structure.db.ObjectId(depositId)},
                {$set : data}
            );
            callback({updateDeposit : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateDeposit : false, message})
        }
    }
    async deleteDeposit(query, callback){
        const {userId, depositId} = query;
        try{
            const result = await m_deposits.deleteDeposit(depositId);
            callback({deleteDeposit : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteDeposit : false, message})
        }
    }
    async getDeposits(query, body, callback){
        const {userId} = query;
        const {filter, rows, skip, sort, max} = body;
        try{
            const result = await m_deposits.getDeposits(
                {...filter}, rows, skip, sort, max);
            callback({ getDeposits : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getDeposits : false, message});
        }
    }
    async getDepositMinMaxIds(query, body, callback){
        const {userId} = query;
        const {filter, sort} = body;
        try{
            const result = {
                minId : await m_deposits.getDepositMinMaxIds({...filter}, sort),
                maxId : await m_deposits.getDepositMinMaxIds({...filter}, sort, true)
            }
            callback({ getDepositMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getDepositMinMaxIds : false, message});
        }
    }
    async searchDeposits(query, body, callback){
        const {userId} = query;
        const {filter, keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_deposits.searchDeposits(
                {...filter}, keyword, rows, skip, sort, max
            );
            callback({ searchDeposits : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchDeposits : false, message});
        }
    }
    async getSearchDepositMinMaxIds(query, body, callback){
        const {userId} = query;
        const {filter, keyword, sort} = body;
        try{
            const result = {
                minId : await m_deposits.getSearchDepositMinMaxIds(
                    {...filter}, keyword, sort),
                maxId : await m_deposits.getSearchDepositMinMaxIds(
                    {...filter}, keyword, sort, true)
            }
            callback({ getSearchDepositMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSearchDepositMinMaxIds : false, message});
        }
    }
    async createDeposit(query, body, callback){
        const {userId} = query,
        {data} = body;
        try{
            const result = await m_deposits.createDeposit(userId, data);
            const {patientId} = data;
            if(patientId)await m_patients.updatePatientQuery(
                {_id : patientId},
                {$inc : {credit : data.amount}}
            )
            callback({createDeposit : true, result, message : success});
        }catch({message}){
            console.error(message);
            callback({createDeposit : false, message});
        }
    }
    /** FAMILIES */
    async getAFamily(query, callback){
        try{
            const familyId = parseInt(query.familyId);
            const result = await m_families.getAFamily(familyId);
            callback({getAFamily : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAFamily : false, message});
        }        
    }
    async deleteFamilyMember(query, callback){
        try{
            const patientId = parseInt(query.patientId);
            const familyId = parseInt(query.familyId);
            const result = await m_families.deleteFamilyMember(familyId, patientId)
            await m_patients.removeFamilyId(patientId);
            callback({deleteFamilyMember : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({deleteFamilyMember : false, message});
        }
    }
    async addFamilyMembers(query, body, callback){
        const {familyId, members, newMembers} = body;
        try{
            if(newMembers) for (let i = 0; i < newMembers.length; i++) {
                const newMemberId = newMembers[i];
                if(await m_families.patientIsAFamilyMember(newMemberId)){
                    throw({message : "Already a member to another family", newMemberId});
                }
            }
            const result = await m_families.addFamilyMembers(familyId, members);
            if(members) for(let i = 0; i < members.length; i++){
                const patientId = members[i];
                await m_patients.addFamilyId(patientId, familyId);
            }
            callback({addFamilyMembers : true, result, message : success})
        }catch(message){
            console.error(message);
            if(typeof message === "string")
                callback({addFamilyMembers : false, message});
            else callback({addFamilyMembers : false, ...message});
        }
    }
    async getFamilies(query, callback){
        try{
            const rows = parseInt(query.rows);
            const skip = parseInt(query.skip);
            const result = await m_families.getFamilies(rows, skip);
            callback({getFamilies : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getFamilies : false, message});
        }
    }
    async deleteFamily(query, callback){
        const familyId = parseInt(query.familyId);
        try{
            const result = await m_families.deleteFamily(familyId);
            callback({deleteFamily : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteFamily : false, message});
        }
    }
    async editFamilyRecord(query, body, callback){
        const {familyId, data} = body;
        try{
            const result = await m_families.editFamilyRecord(familyId, data);
            callback({editFamilyRecord : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editFamilyRecord : false, message});
        }
    }
    async createFamilyRecord(query, body, callback){
        try{
            const result = await m_families.createFamilyRecord(body);
            callback({createFamilyRecord : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createFamilyRecord : false, message});
        }
    }
    async getFamilyMinMaxIds(query, callback){
        try{
            const maxId = await m_families.getMinMaxId("max");
            const minId = await m_families.getMinMaxId();
            callback({getFamilyMinMaxIds : true,result : {maxId, minId}, message : success});
        }catch(message){
            console.error(message);
            callback({getFamilyMinMaxIds : false, message});
        }
    }
    /** USERS */
    async searchUser(query, callback){
        const {keyword} = query;
        try{
            const result = m_users.searchUser(keyword);
        }catch(message){    
            console.error(message);
            callback({searchUser : false, message});
        }
    }
    async updateUserProfile(query, body, callback){
        const {userId, profile} = body;
        try{
            profile.privilege = profile.privilege === "admin" ? 11 : 12;
            const result = await m_users.updateProfile(userId, profile);
            callback({updateUserProfile : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateUserProfile : false, message});
        }
    }
    async suspendUser(query, callback){
        const userId = parseInt(query.id);
        try{
            await m_users.suspendUser(userId);
            const result = await m_users.getUser(userId);
            callback({suspendUser : true, result, message : success});
        }catch (message){
            console.error(message);
            callback({suspendUser : false, message});
        }
    }
    async activateUser(query, callback){
        const userId = parseInt(query.id);
        try{
            const result = await m_users.activateUser(userId);
            callback({activateUser : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({activateUser : false, message});
        }
    }
    async archiveUser(query, callback){
        const userId = parseInt(query.id);
        try{
            await m_users.archiveUser(userId);
            const result = await m_users.getUser(userId);
            callback({archiveUser : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({archiveUser : false, message});
        }
    }
    async getUsers(query, callback){
        const {userId, token} = query;
        try{
            const result = await m_users.getUsers();
            callback({getUsers : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getUsers : false, message});
        }
    }
    async createUser(query, data, callback){
        const {userId } = query;
        const {email, userName, phone, privilege} = data;
        try{
            data.privilege = privilege === "admin" ? 11 : 12;
            data.registrationDate = new Date();
            if(await m_users.emailExists(email))
                throw("Email already exists");
            if(await m_users.usernameExists(userName))
                throw("Username already exists");
            const user = await m_users.signup(data);
            const result = await m_users.getUsers();
            callback({createUser : true, result, user, message : success});
        }catch(message){
            console.error(message);
            callback({createUser : false, message});
        }
    }



    /** ACCOUNTS */
    async getMultiplePatientYearlyPayments(query, body, callback){
        const {patientIds, year} = body;
        try{
            const result = await m_payments.getMultiplePatientYearlyPayments(patientIds, year);
            callback({getMultiplePatientYearlyPayments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getMultiplePatientYearlyPayments : false, message});
        }
    }
    async getPatientYearlyPayments(query, callback){
        try{
            const patientId = parseInt(query.patientId);
            const year = parseInt(query.year);
            const result = await m_payments.getPatientYearlyPayments(patientId, year);
            callback({getPatientYearlyPayments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientYearlyPayments : false, message});
        }
    }
    async updatePayment(query, body, callback){
        const {paymentId, data} = body;
        data.actionDate = new Date(data.actionDate);
        try{
            await m_payments.updatePayment(paymentId, data);
            const result = await m_payments.getAPayment(paymentId);
            callback({updatePayment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updatePayment : false, message});
        }
    }
    async deletePayment(query, callback){
        const {paymentId, groupId} = query;
        try{
            if(groupId !== 'undefined' && groupId !== "null"){
                await m_paymentgroup.deletePaymentFromGroup(groupId, paymentId);
                const group = await m_paymentgroup.getPaymentGroup(groupId);
                if(group && group.length === 0)
                    await m_paymentgroup.deleteGroup(groupId);
            }
            const result = await m_payments.deletePayment(paymentId);
            callback({deletePayment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deletePayment : false, message});
        }
    }
    async getActualAppointmentMonthDayData(query, body, callback){
        const {year, month } = body;
        try{
            const result = await m_appointments.getActualAppointmentMonthDayData(year, month);
            callback({getActualAppointmentMonthDayData : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getActualAppointmentMonthDayData :false, message});
        }
    }
    async getActualAppointmentYearMonthData(query, body, callback){
        const {year} = body;
        try{
            const result = await m_appointments.getActualAppointmentYearMonthData(year);
            callback({getActualAppointmentYearMonthData : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getActualAppointmentYearMonthData : false, message});
        }
    }
    async getAppointmentMonthDayData(query, body, callback){
        const {year, month } = body;
        try{
            const result = await m_appointments.getAppointmentMonthDayData(year, month);
            callback({getAppointmentMonthDayData : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAppointmentMonthDayData :false, message});
        }
    }
    async getAppointmentYearMonthData(query, body, callback){
        const {year} = body;
        try{
            const result = await m_appointments.getAppointmentYearMonthData(year);
            callback({getAppointmentYearMonthData : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAppointmentYearMonthData : false, message});
        }
    }



    async getPaymentDayTotalAmount(query, body, callback){
        const {year, month, day} = body;
        try{
            const result = await m_payments.getPaymentDayTotalAmount(year, month, day);
            callback({getPaymentDayTotalAmount :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPaymentDayTotalAmount :false, message});
        }
    }
    async getPaymentMonthTotalAmount(query, body, callback){
        const {year, month} = body;
        try{
            const result = await m_payments.getPaymentMonthTotalAmount(year, month);
            callback({getPaymentMonthTotalAmount :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPaymentMonthTotalAmount :false, message});
        }
    }
    async getPaymentYearTotalAmount(query, body, callback){
        const {year} = body;
        try{
            const result = await m_payments.getPaymentYearTotalAmount(year);
            callback({getPaymentYearTotalAmount :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPaymentYearTotalAmount :false, message});
        }
    }
    async getPaymentYearMonthData(query, body, callback){
        const {year} = body;
        try{
            const result = await m_payments.getPaymentYearMonthData(year);
            callback({getPaymentYearMonthData : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getPaymentYearMonthData : false, message});
        }
    }
    async getPaymentMonthDayData(query, body, callback){
        const {year, month} = body;
        try{
            const result = await m_payments.getPaymentMonthDayData(year, month);
            callback({getPaymentMonthDayData : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getPaymentMonthDayData : false, message});
        }
    }
    async searchPaymentsByPatient(query, callback){
        const {keyword} = query;
        try{
            const result = await m_payments.searchPaymentsByPatient(keyword);
            callback({searchPaymentsByPatient : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchPaymentsByPatient : false, message});
        }
    }
    async searchPaymentsByDateRange(query, body, callback){
        const {startDate, endDate, filter} = body;
        try{
            const result = await m_payments.searchPaymentsByDateRange(
                startDate, endDate, filter
            );
            callback({searchPaymentsByDateRange : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchPaymentsByDateRange : false, message});
        }
    }
    async searchPaymentsByDate(query, body, callback){
        const {year, month, day} = body;
        try{
            const result = await m_payments.searchPaymentsByDate(
                year, month, day
            );
            callback({searchPaymentsByDate : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchPaymentsByDate : false, message});
        }
    }
    async getPaymentByUserIdAndDate(query, body, callback){
        const {year, month, day, userId} = body;
        try{
            const result = await m_payments.getPaymentByUserIdAndDate(
                userId, year, month, day
            );
            callback({getPaymentByUserIdAndDate : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({getPaymentByUserIdAndDate : false, message});
        }
    }
    async getUserPaymentsByDate(query, body, callback){
        const {year, month, day} = body;
        try{            
            const result = await m_payments.getUserPaymentsByDate(year, month, day);
            callback({getUserPaymentsByDate : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getUserPaymentsByDate : false, message});
        }
    }
    async getPaymentByRevenueTypeAndDate(query, body, callback){
        const {year, month, day, revenueName} = body;
        try{
            const result = await m_payments.getPaymentByRevenueTypeAndDate(
                revenueName, year, month, day
            );
            callback({getPaymentByRevenueTypeAndDate : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({getPaymentByRevenueTypeAndDate : false, message});
        }
    }
    async getRevenuePaymentsByDate(query, body, callback){
        const {year, month, day} = body;
        try{            
            const result = await m_payments.getRevenuePaymentsByDate(year, month, day);
            callback({getRevenuePaymentsByDate : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getRevenuePaymentsByDate : false, message});
        }
    }
    async getPayments(query, callback){
        const lastId = query.lastId === "null" ? null : query.lastId;
        const rows = parseInt(query.rows);
        try{
            const result = await m_payments.getPayments(lastId, rows);
            callback({getPayments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPayments : false, message});
        }
    }
    async getPatientPayments(query, callback){
        const patientId = parseInt(query.patientId);
        try{
            const result = await m_payments.getPatientPayments(patientId);
            callback({getPatientPayments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientPayments : false, message});
        }
    }
    async getPaymentGroup(query, callback){
        const {groupId} = query;
        try{
            const result = await m_paymentgroup.getPaymentGroup(groupId);
            callback({getPaymentGroup : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPaymentGroup : false, message });
        }
    }
    async postPayment(query, body, callback){
        const {userId} = query;
        const {patientId, data} = body;
        try{
            const patient = await m_patients.getAPatient(patientId);
            if(data.paymentList){
                let paymentIds = [], totalAmount = 0;
                let storedPayment;
                for (let i = 0; i < data.paymentList.length; i++) {
                    const payment = data.paymentList[i];
                    totalAmount += payment.amount;
                    if(data.actionDate) payment.actionDate = data.actionDate;
                    storedPayment = await m_payments.postPayment(userId, {...payment, patientId});
                    paymentIds.push(storedPayment._id);
                }
                const storedGroup = await m_paymentgroup.createPaymentGroup({paymentIds, totalAmount});
                await m_payments.updatePaymentGroupsToPayments(paymentIds, storedGroup._id);
                storedPayment.groupId = storedGroup._id;
                callback({postPayment : true, paymentIds, result : storedPayment, storedGroup, message : success});
            }else{
                if(data.accountAction){
                    if(accountAction === "useCredit"){
                        await m_patients.updatePatientQuery(
                            {_id : patientId},
                            {$set : {$inc : -data.amount}}
                        )
                    }
                }
                const result = await m_payments.postPayment(userId, {...data, patientId});
                callback({postPayment : true, result, message : success});
            }
        }catch(message){
            console.error(message);
            callback({postPayment : false, message});
        }
    }
    /** SETTINGS */
    async editSettingValue(query, body, callback) {
        let {settingId, valueName, value} = body;
        try{
            await m_settings.editSettingValue(settingId, valueName, value);
            const result = await m_settings.getSettings();
            callback({editSettingValue : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editSettingValue : false, message});
        }
    }
    async deleteSettingValue(query, callback){
        let {settingId, valueName} = query;
        try{
            await m_settings.deleteSettingValue(settingId, valueName);
            const result = await m_settings.getSettings();
            callback({deleteSettingValue : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteSettingValue : false, message});
        }

    }
    async addSettingValue(query, body, callback){
        let {settingId, settingName, value} = body;
        try{
            await m_settings.addSettingValue(
                settingId, 
                { 
                    name : String(value).toLowerCase().split(" ").join(""),
                    value
                }
            );
            const result = await m_settings.getSettings();
            callback({addSettingValue : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({addSettingValue : false, message});
        }
    }
    async getSettings(query, callback){
        try{
            let result = await m_settings.getSettingsByNames(["units", "revenue"]);
            if(!result || result.length === 0){
                result = await m_settings.createSettings([
                    {
                        name : "units",
                        header : "Hospital Units",
                        values : []
                    },{
                        name : "revenue",
                        header : "Revenue Categories",
                        values : []
                    }
                ])
            }
            callback({getSettings : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSettings : false, message});
        }
    }

    /**Appointments */
    async getMultiplePatientYearlyAppointments(query, body, callback){
        const {patientIds, year} = body;
        try{
            const result = await m_appointments.getMultiplePatientYearlyAppointments(patientIds, year);
            callback({getMultiplePatientYearlyAppointments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getMultiplePatientYearlyAppointments : false, message});
        }
    }
    async getPatientYearlyAppointments(query, callback){
        const patientId = parseInt(query.patientId);
        const year = parseInt(query.year);
        try{
            const result = await m_appointments.getPatientYearlyAppointments(patientId, year);
            callback({getPatientYearlyAppointments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientYearlyAppointments : false, message});
        }
    }
    async deleteAppointment(query, callback){
        const {appointId} = query;
        try{
            const result = await m_appointments.deleteAppointment(appointId);
            callback({deleteAppointment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteAppointment : false, message});
        }
    }
    async getRecentVisitedPatientByDate(query, body, callback){
        const {year, month, day, limit} = body;
        if(!limit) limit = 20;
        try{
            const result = await m_appointments.getRecentVisitedPatientByDate(year, month, day, limit);
            callback({getRecentVisitedPatientByDate : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getRecentVisitedPatientByDate :true, message});
        }
    }
    async getAppointmentDayTotalCount(query, body, callback){
        const {year, month, day} = body;
        try{
            const result = await m_appointments.getAppointmentDayTotalCount(year, month, day);
            callback({getAppointmentDayTotalCount : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAppointmentDayTotalCount : false, message});
        }
    }
    async getAppointmentMonthTotalCount(query, body, callback){
        const {year, month} = body;
        try{
            const result = await m_appointments.getAppointmentMonthTotalCount(year, month);
            callback({getAppointmentMonthTotalCount : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAppointmentMonthTotalCount : false, message});
        }
    }
    async getAppointmentYearTotalCount(query, body, callback){
        const {year} = body;
        try{
            const result = await m_appointments.getAppointmentYearTotalCount(year);
            callback({getAppointmentYearTotalCount : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAppointmentYearTotalCount : false, message});
        }
    }
    async getAnAppointment(query, callback) {
        const {appointId} = query;
        try{
            const result = await m_appointments.getAnAppointment(appointId);
            callback({getAnAppointment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAnAppointment : false, message});
        }
    }
    async unApproveAppointment(query, callback){
        const {appointId, userId} = query;
        try{
            await m_appointments.unApproveAppointment(userId, appointId);
            const result = await m_appointments.getAnAppointment(appointId);
            callback({unApproveAppointment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({unApproveAppointment : false, message});
        }
    }
    async approveAppointment(query, callback){
        const {appointId, userId} = query;
        try{
            await m_appointments.approveAppointment(userId, appointId);
            const result = await m_appointments.getAnAppointment(appointId);
            callback({approveAppointment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({approveAppointment : false, message});
        }
    }
    async searchAppointmentsByDate(query, callback){
        const {date} = query;
        try{
            const result = await m_appointments.searchAppointmentsByDate(date);
            callback({searchAppointmentsByDate :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchAppointmentsByDate : false, message});
        }
    }
    async searchAppointments(query, callback){
        const {keyword} = query;
        try{
            const result = await m_appointments.searchAppointments(keyword);
            callback({searchAppointments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchAppointments : false, message});
        }
    }
    async getTodayAppointments(query, callback){
        try{
            const result = await m_appointments.getTodayAppointments();
            callback({getTodayAppointments : true, result, message : success});
        }catch(message){
            console.error(message)
            callback({getTodayAppointments : false, message});
        }
    }
    async getAppointments(query, callback){
        const lastId = query.lastId === "null" ? null : query.lastId;
        const rows = parseInt(query.rows);
        const skip = parseInt(query.skip);
        try{
            const result = await m_appointments.getAppointments(lastId, rows, skip);
            callback({getAppointments : true, result, message : success});
        }catch (message){
            console.error(message);
            callback({getAppointments : false, message});
        }
    }
    async bookAppointment(query, body, callback){
        const userId = query.userId;
        try{
            const result = await m_appointments.bookAppointment(userId, body);
            callback({bookAppointment : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({bookAppointment : false, message});
        }
    }
    async getPatientAppointments(query, callback){
        const patientId = parseInt(query.patientId);
        try{
            const result = await m_appointments.getPatientAppointments(patientId);
            callback({getPatientAppointments : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientAppointments : false, message});
        }
    }


    /* patients */
    async migratePatientData(query, body, callback){
        const {patients} = body;
        try{
            const result = await m_patients.migratePatientData(patients);
            callback({migratePatientData : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({migratePatientData : false, message});
        }
    }
    async getPatientsByIds(query, body, callback){
        const {patientIds} = body;
        try{
            const result = await m_patients.getPatientsByIds(patientIds);
            callback({getPatientsByIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientsByIds : false, message});
        }
    }
    async getPatientsByOldIds(query, body, callback){
        const {patientIds} = body;
        try{
            const result = await m_patients.getPatientsByOldIds(patientIds);
            callback({getPatientsByOldIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientsByOldIds : false, message});
        }
    }
    async getPatientDayTotalCount(query, body, callback){
        const {year, month, day} = body;
        try{
            const result = await m_patients.getPatientDayTotalCount(year, month, day);
            callback({getPatientDayTotalCount :true, result, message : success})
        }catch(message){
            console.error(message);
            callback({getPatientDayTotalCount : false, message});
        }
    }
    async getPatientMonthTotalCount(query, body, callback){
        const {year, month} = body;
        try{
            const result = await m_patients.getPatientMonthTotalCount(year, month);
            callback({getPatientMonthTotalCount :true, result, message : success})
        }catch(message){
            console.error(message);
            callback({getPatientMonthTotalCount : false, message});
        }
    }
    async getPatientYearTotalCount(query, body, callback){
        const {year} = body;
        try{
            const result = await m_patients.getPatientYearTotalCount(year);
            callback({getPatientYearTotalCount :true, result, message : success})
        }catch(message){
            console.error(message);
            callback({getPatientYearTotalCount : false, message});
        }
    }
    async getPatientMonthDayData(query, body, callback){
        const {year, month} = body;
        try{
            const result = await m_patients.getPatientMonthDayData(year, month);
            callback({getPatientMonthDayData :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientMonthDayData : false, message});
        }
    }
    async getPatientYearMonthData(query, body, callback){
        const {year} = body;
        try{
            const result = await m_patients.getPatientYearMonthData(year);
            callback({getPatientYearMonthData : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatientYearMonthData : false, message});
        }
    }
    async getSearchMinMaxPatientId(query, callback){
        const {keyword} = query;
        try{
            const maxId = await m_patients.getSearchMinMaxPatientId(keyword, "max");
            const minId = await m_patients.getSearchMinMaxPatientId(keyword);
            callback({getSearchMinMaxPatientId : true, result : {maxId, minId}, message : success});
        }catch(message){
            console.error(message);
            callback({getSearchMinMaxPatientId : false, message})
        }
    }
    async searchPatient(query, callback){
        const {keyword} = query;
        const rows = parseInt(query.rows);
        const skip = parseInt(query.skip);

        try{
            const result = await m_patients.searchPatient(keyword, rows, skip);
            callback({searchPatient : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchPatient :false, message});
        }
    }
    async getAPatient(query, callback){
        const patientId = parseInt(query.patientId);
        try{
            const result = await m_patients.getAPatient(patientId);
            callback({getAPatient : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAPatient : false, message});
        }
    }
    async editRecord(query, body, callback){
        const {data, patientId} = body;
        try{
            const result = await m_patients.editRecord(patientId, data);
            callback({editRecord : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editRecord : false, message});
        }
    }
    async getPatients(query, callback){
        const rows = parseInt(query.rows);
        const skip = parseInt(query.skip);
        try{
            const result = await m_patients.getPatients(rows, skip);
            callback({getPatients : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPatients : false, message});
        }
    }
    async createRecord(query, body, callback){
        const {userId } = query;
        try{
            const result = await m_patients.createRecord(userId, body);
            callback({createRecord : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createRecord : false, message});
        }
    }
    async getMaxMinPatientIds(query, callback){
        try{
            const maxId = await m_patients.getMaxId();
            const minId = await m_patients.getMinId();
            callback({getMaxMinPatientIds : true, maxId, minId, message: success});
        }catch(message){
            console.error(message);
            callback({getMaxMinPatientIds : false, message});
        }
    }
    async getMaxMinAppointmentIds(query, callback){
        try{
            const maxId = await m_appointments.getMaxId();
            const minId = await m_appointments.getMinId();
            callback({getMaxMinAppointmentIds : true, maxId, minId, message: success});
        }catch(message){
            console.error(message);
            callback({getMaxMinAppointmentIds : false, message});
        }
    }



    async signup(query, body, callback){
        let response;
        const {admin, token, userId} = query;
        body.admin = false;
        if(admin === 1 && token && userId){
             body.admin = true;
        }
        try{
            if(!await m_users.emailExists(body.email)){
                body.token = await m_users.generateToken();
                const result = await m_users.signup(body);
                response = {signup: true, result, message : "Success!"};
                if(callback) callback(response);
                else return response;
            }
            else{
                response = {signup: false, message : "Email already exists"};
                if(callback) callback(response);
                else return response;
            }
            
        }catch(err){
            response = {signup : false, message : err};
            if(callback) callback(response);
            else return response;
        }
    }
    async login(loginDetails, callback){
        const {email, password} = loginDetails;
        try{
            const result = await m_users.login(email.toLowerCase(), password);
            const token = await m_users.generateToken();
            result.myProfile.token = token;
            await m_users.saveToken(result._id, token);
            callback({login: true, message : "Success!", result});
        }catch(e){
            console.error(e);
            callback({login: false, message : e});
        }
    }
    async getUser(query, callback){
        const userId = parseInt(query.userId);
        try{
            const result = await m_users.getUser(userId);
            callback({getUser : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getUser : false, message});
        }
    }
    async verifyUser(userId, token){
        try{
            const user = await m_users.getUser(userId);
            if(user && user.myProfile && user.myProfile.token === token){
                switch(req.params.owner){
                    case "admin" : 
                        if(user.myProfile.admin)
                            adminOwner(req, res); 
                        else throw("Privilege denied");
                        break;
                    case "user" : userOwner(req, res);break;
                }
            }else{
                throw("This profile does not exist")
            }
        }catch(message){
            res.send({[req.params.action] : false, message})
        }
    }
}