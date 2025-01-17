const express = require('express');
const router = express.Router();

const savingAccountController = require('./controllers/saveDetails/savingAccountController');
const loanController = require('./controllers/saveDetails/loanController');
const fixedDepositController = require('./controllers/saveDetails/fixedDepositController');
const ledgerNameController = require('./controllers/showDetails/savingAcc/savingLedgerNameController');
const loanLedgerNameController = require('./controllers/showDetails/loanAcc/loanLedgerNameController');
const fixedDepoLedgerNameController = require('./controllers/showDetails/fixedDepoAcc/fixedDepoLedgerNameController');

const customerTypeController = require('./controllers/showDetails/customerTypeController');
const instituteListController = require('./controllers/showDetails/instituteListController');
const searchClientIDforNameController = require('./controllers/showDetails/searchClientIDforNameController');
const currentAccountDetailsController = require('./controllers/showDetails/currentAccountDetailsController');

const cusRegiController = require('./controllers/customer/cusRegiController');
const cusInfoUpdateController = require('./controllers/customer/cusInfoUpdateController');
const cusInforShowController = require('./controllers/customer/cusInforShowController');
const allInstituteListController = require('./controllers/customer/allInstituteListController');

const loginController = require('./controllers/auth/loginController');
const GSDivisionNoListController = require('./controllers/customer/dropDown/GSDivisionNoListController');
const GSDivisionNameListController = require('./controllers/customer/dropDown/GSDivisionNameListController');
const AGDivisionListController = require('./controllers/customer/dropDown/AGDivisionListController');
const DistrictListController = require('./controllers/customer/dropDown/DistrictListController');
const ReligionListController = require('./controllers/customer/dropDown/ReligionListController');
const GroupCodeController = require('./controllers/customer/dropDown/GroupCodeController');

// get name and number of GSDivision
const GSDivisionListController = require('./controllers/customer/dropDown/GSDivisionListController');

// login
router.post('/login', loginController.login);

// save all data from client
router.post('/savingAccSave' ,savingAccountController.savingAccSave);
router.post('/loanSave' ,loanController.loanSave);
router.post('/fixedDepositSave' ,fixedDepositController.fixedDepositSave);

// show LedgerName
router.get('/SavingLedgerName' ,ledgerNameController.savingAccLedgerName);
router.get('/loanLedgerName' ,loanLedgerNameController.loanLedgerName);
router.get('/fixedDepoLedgerName' ,fixedDepoLedgerNameController.fixedDepoLedgerName);

// show Customer Type
router.get('/CustomerType' ,customerTypeController.CustomerType);

// showinstitute List (requeried LedgerID)
router.post('/instituteList' ,instituteListController.instituteList);

// search client ID for get client name
router.post('/searchClient' , searchClientIDforNameController.searchClient);

// show user current account details
router.post('/currentAccountDetails' , currentAccountDetailsController.currentAccountDetails);

// customer
router.post('/customer-Register' ,cusRegiController.cusRegister);
router.put('/customer-info-update' ,cusInfoUpdateController.cusInfoUpdate);
router.get('/customer-info' ,cusInforShowController.cusInfoShow);

//List
// show all institute list without any user input
router.get('/allInstituteList' ,allInstituteListController.allInstituteList);

router.get('/GSDivisionNoList' ,GSDivisionNoListController.GSDivisionNoList);
router.get('/GSDivisionNameList' ,GSDivisionNameListController.GSDivisionNameList);
// get name and number of GSDivision
router.get('/GSDivisionList' ,GSDivisionListController.GSDivisionList);

router.get('/AGDivisionList' ,AGDivisionListController.AGDivisionList);
router.get('/DistrictList' ,DistrictListController.DistrictList);
router.get('/ReligionList' ,ReligionListController.ReligionList);
router.get('/GroupCodeDetails' ,GroupCodeController.GroupCodeDetails);




// Export the router
module.exports = router;