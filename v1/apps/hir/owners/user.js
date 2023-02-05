const _hirWorker = require("../workers/hir_woker");

const hirWorker = new _hirWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION", action);
    switch(action){
        case "deletePaymentDetailFromDate" : 
            return hirWorker.deletePaymentDetailFromDate(req.query, req.body, result => res.send(result));
        case "createClinicPatient" : 
            return hirWorker.createClinicPatient(req.query, req.body, result => res.send(result));

        case "revertRefund" : 
            return hirWorker.revertRefund(req.query, result => res.send(result));
        case "getRefunds" :
            return hirWorker.getRefunds(req.query, req.body, result=>res.send(result));
        case "getRefundMinMaxIds" :
            return hirWorker.getRefundMinMaxIds(req.query, req.body, result=>res.send(result));
        case "searchRefunds" :
            return hirWorker.searchRefunds(req.query, req.body, result=>res.send(result));
        case "getSearchRefundMinMaxIds" :
            return hirWorker.getSearchRefundMinMaxIds(req.query, req.body, result=>res.send(result));
        
        case "getRefundByGroup" : 
            return hirWorker.getRefundByGroup(req.query, req.body, result=>res.send(result));
        case "refundCredit" : 
            return hirWorker.refundCredit(req.query, req.body, result=>res.send(result));
        case "getDebtHxs" :
            return hirWorker.getDebtHxs(req.query, req.body, result=>res.send(result));
        case "getDebtHxMinMaxIds" :
            return hirWorker.getDebtHxMinMaxIds(req.query, req.body, result=>res.send(result));
        case "searchDebtHxs" :
            return hirWorker.searchDebtHxs(req.query, req.body, result=>res.send(result));
        case "getSearchDebtHxMinMaxIds" :
            return hirWorker.getSearchDebtHxMinMaxIds(req.query, req.body, result=>res.send(result));
        
        case "balanceOutDebt" :
            return hirWorker.balanceOutDebt(req.query, result=>res.send(result));
        case "getDebtors" :
            return hirWorker.getDebtors(req.query, req.body, result=>res.send(result));
        case "getDebtorMinMaxIds" :
            return hirWorker.getDebtorMinMaxIds(req.query, req.body, result=>res.send(result));
        case "searchDebtors" :
            return hirWorker.searchDebtors(req.query, req.body, result=>res.send(result));
        case "getSearchDebtorMinMaxIds" :
            return hirWorker.getSearchDebtorMinMaxIds(req.query, req.body, result=>res.send(result));
        
        case "getDepositGroup" :
            return hirWorker.getDepositGroup(req.query, req.body, result=>res.send(result));
        case "updateDeposit" :
            return hirWorker.updateDeposit(req.query, req.body, result=>res.send(result));
        case "deleteDeposit" :
            return hirWorker.deleteDeposit(req.query, result=>res.send(result));
        case "getDeposits" :
            return hirWorker.getDeposits(req.query, req.body, result=>res.send(result));
        case "getDepositMinMaxIds" :
            return hirWorker.getDepositMinMaxIds(req.query, req.body, result=>res.send(result));
        case "searchDeposits" :
            return hirWorker.searchDeposits(req.query, req.body, result=>res.send(result));
        case "getSearchDepositMinMaxIds" :
            return hirWorker.getSearchDepositMinMaxIds(req.query, req.body, result=>res.send(result));
        
        case "createDeposit" : 
            return hirWorker.createDeposit(req.query, req.body, result=>res.send(result));
        case "getAFamily" : 
            return hirWorker.getAFamily(req.query, result => res.send(result));
        case "deleteFamilyMember" : 
            return hirWorker.deleteFamilyMember(req.query, result=>res.send(result));
        case "addFamilyMembers" :
            return hirWorker.addFamilyMembers(req.query, req.body, result=>res.send(result));
        case "getFamilies" : 
            return hirWorker.getFamilies(req.query, result => res.send(result));
        case "deleteFamily" : 
            return hirWorker.deleteFamily(req.query, result=>res.send(result));
        case "editFamilyRecord" :
            return hirWorker.editFamilyRecord(req.query, req.body, result=>res.send(result));
        case "createFamilyRecord" : 
            return hirWorker.createFamilyRecord(req.query, req.body, result=>res.send(result));
        case "getFamilyMinMaxIds" : 
            return hirWorker.getFamilyMinMaxIds(req.query, result => res.send(result));

        case "searchUser" : 
            return hirWorker.searchUser(req.query, result => res.send(result));
        case "updateUserProfile" : 
            return hirWorker.updateUserProfile(req.query, req.body, result=>res.send(result));
        case "activateUser" : 
            return hirWorker.activateUser(req.query, result => res.send(result));
        case "suspendUser" : 
            return hirWorker.suspendUser(req.query, result=>res.send(result));
        case "archiveUser" : 
            return hirWorker.archiveUser(req.query, result=>res.send(result));
        case "getUsers" : 
            return hirWorker.getUsers(req.query, result=>res.send(result));
        case "createUser" : 
            return hirWorker.createUser(req.query, req.body, result=>res.send(result));
        

        case "getPaymentGroup" : 
            return hirWorker.getPaymentGroup(req.query, result=>res.send(result));
        case "updatePayment" : 
            return hirWorker.updatePayment(req.query, req.body, result=>res.send(result));
        case "deletePayment" : 
            return hirWorker.deletePayment(req.query, result=>res.send(result));
        
        case "getPaymentDayTotalAmount" : 
            return hirWorker.getPaymentDayTotalAmount(req.query, req.body, result=>res.send(result));
        case "getPaymentMonthTotalAmount" : 
            return hirWorker.getPaymentMonthTotalAmount(req.query, req.body, result=>res.send(result));
        case "getPaymentYearTotalAmount" : 
            return hirWorker.getPaymentYearTotalAmount(req.query, req.body, result=>res.send(result));
        case "getPaymentYearMonthData" : 
            return hirWorker.getPaymentYearMonthData(req.query, req.body, result=>res.send(result));
        case "getPaymentMonthDayData" : 
            return hirWorker.getPaymentMonthDayData(req.query, req.body, result=>res.send(result));
            

        case "getMultiplePatientYearlyPayments" : 
            return hirWorker.getMultiplePatientYearlyPayments(req.query, req.body, result=>res.send(result));
        case "getPatientYearlyPayments" : 
            return hirWorker.getPatientYearlyPayments(req.query, result=>res.send(result));
        case "searchPaymentsByPatient":
            return hirWorker.searchPaymentsByPatient(req.query, result=>res.send(result));
        case "searchPaymentsByDateRange" : 
            return hirWorker.searchPaymentsByDateRange(req.query, req.body, result=>res.send(result));
        case "searchPaymentsByDate" : 
            return hirWorker.searchPaymentsByDate(req.query, req.body, result=>res.send(result));
        case "getPaymentByUserIdAndDate" : 
            return hirWorker.getPaymentByUserIdAndDate(req.query, req.body, result=>res.send(result));
        case "searchUserDepositsByDateRange" : 
            return hirWorker.searchUserDepositsByDateRange(req.query, req.body, result=>res.send(result));
        case "searchUserPaymentsByDateRange" : 
            return hirWorker.searchUserPaymentsByDateRange(req.query, req.body, result=>res.send(result));
        case "getUserDepositsByDate" : 
            return hirWorker.getUserDepositsByDate(req.query, req.body,result=>res.send(result));
        case "getUserPaymentsByDate" : 
            return hirWorker.getUserPaymentsByDate(req.query, req.body,result=>res.send(result));
        case "getPaymentByRevenueTypeAndDate" : 
            return hirWorker.getPaymentByRevenueTypeAndDate(req.query, req.body, result=>res.send(result));
        case "getRevenuePaymentsByDateRange" : 
            return hirWorker.getRevenuePaymentsByDateRange(req.query, req.body, result=>res.send(result));
        case "getRevenuePaymentsByDate" : 
            return hirWorker.getRevenuePaymentsByDate(req.query, req.body, result=>res.send(result));
        case "getPayments" : 
            return hirWorker.getPayments(req.query, result=>res.send(result));
        case "getPatientPayments" : 
            return hirWorker.getPatientPayments(req.query, result => res.send(result));
        case "postPayment" : 
            return hirWorker.postPayment(req.query, req.body, result => res.send(result));
        

        case "getRecentVisitedPatientByDate" : 
            return hirWorker.getRecentVisitedPatientByDate(req.query, req.body, result=>res.send(result));

        case "getAppointmentDayTotalCount" : 
            return hirWorker.getAppointmentDayTotalCount(req.query, req.body, result=>res.send(result));
        case "getAppointmentMonthTotalCount" : 
            return hirWorker.getAppointmentMonthTotalCount(req.query, req.body, result=>res.send(result));
        case "getAppointmentYearTotalCount" : 
            return hirWorker.getAppointmentYearTotalCount(req.query, req.body, result=>res.send(result));
        case "getActualAppointmentMonthDayData" : 
            return hirWorker.getActualAppointmentMonthDayData(req.query, req.body, result=>res.send(result));
        case "getActualAppointmentYearMonthData" : 
            return hirWorker.getActualAppointmentYearMonthData(req.query, req.body, result=>res.send(result));
        case "getAppointmentMonthDayData" : 
            return hirWorker.getAppointmentMonthDayData(req.query, req.body, result=>res.send(result));
        case "getAppointmentYearMonthData" : 
            return hirWorker.getAppointmentYearMonthData(req.query, req.body, result=>res.send(result));

        
        case "getMultiplePatientYearlyAppointments" : 
            return hirWorker.getMultiplePatientYearlyAppointments(req.query, req.body, result=>res.send(result));
        case "getPatientYearlyAppointments" : 
            return hirWorker.getPatientYearlyAppointments(req.query, result=>res.send(result));
        case "deleteAppointment" : 
            return hirWorker.deleteAppointment(req.query, result=>res.send(result));
        case "getAnAppointment" : 
            return hirWorker.getAnAppointment(req.query, result=>res.send(result));
        case "unApproveAppointment" : 
            return hirWorker.unApproveAppointment(req.query, result=>res.send(result));
        case "approveAppointment" : 
            return hirWorker.approveAppointment(req.query, result=>res.send(result));
        case "searchAppointmentsByDate" : 
            return hirWorker.searchAppointmentsByDate(req.query, result=>res.send(result));
        case "searchAppointments" : 
            return hirWorker.searchAppointments(req.query, result=>res.send(result));
        case "getTodayAppointments" :  
            return hirWorker.getTodayAppointments(req.query, result=>res.send(result));
        case "getAppointments" : 
            return hirWorker.getAppointments(req.query, result=>res.send(result));
        case "bookAppointment" : 
            return hirWorker.bookAppointment(req.query, req.body, result=>res.send(result));
        case "getPatientAppointments" : 
            return hirWorker.getPatientAppointments(req.query, result=>res.send(result));
        
        case "editSettingValue" : 
            return hirWorker.editSettingValue(req.query, req.body, result=>res.send(result));
        case "deleteSettingValue" : 
            return hirWorker.deleteSettingValue(req.query, reuslt=>res.send(reuslt));
        case "addSettingValue" : 
            return hirWorker.addSettingValue(req.query, req.body, result=>res.send(result));
        case "getSettings" : 
            return hirWorker.getSettings(req.query, result=>res.send(result));
        

        case "migratePatientData" : 
            return hirWorker.migratePatientData(req.query, req.body, result=>res.send(result));
        
        case "getPatientsByIds" :
            return hirWorker.getPatientsByIds(req.query, req.body, result=>res.send(result));
        case "getPatientsByOldIds" : 
            return hirWorker.getPatientsByOldIds(req.query, req.body, result=>res.send(result));
        case "getPatientDayTotalCount" : 
            return hirWorker.getPatientDayTotalCount(req.query, req.body, result=>res.send(result));
        case "getPatientMonthTotalCount" : 
            return hirWorker.getPatientMonthTotalCount(req.query, req.body, result=>res.send(result));
        case "getPatientYearTotalCount" : 
            return hirWorker.getPatientYearTotalCount(req.query, req.body, result=>res.send(result));
        case "getPatientMonthDayData" :
            return hirWorker.getPatientMonthDayData(req.query, req.body, result=>res.send(result));
        case "getPatientYearMonthData" :
            return hirWorker.getPatientYearMonthData(req.query, req.body, result=>res.send(result));
        case "getSearchMinMaxPatientId" : 
            return hirWorker.getSearchMinMaxPatientId(req.query, result=>res.send(result));
        case "searchPatient" : 
            return hirWorker.searchPatient(req.query, result => res.send(result));
        case "getAPatient" : 
            return hirWorker.getAPatient(req.query, result=>res.send(result));
        case "editRecord" : 
            return hirWorker.editRecord(req.query, req.body, result=>res.send(result));
        case "createRecord" : 
            return hirWorker.createRecord(req.query, req.body, result=>res.send(result));
        case "getPatients" : 
            return hirWorker.getPatients(req.query, result=>res.send(result));
        case "getMaxMinPatientIds" :
            return hirWorker.getMaxMinPatientIds(req.query, result=>res.send(result));
        case "getMaxMinAppointmentIds" :
            return hirWorker.getMaxMinAppointmentIds(req.query, result=>res.send(result));


        case "login" :
            return hirWorker.login(req.body, result=>res.send(result));
        case "getUser" : 
            return hirWorker.getUser(req.query, result=>res.send(result));
    }
}