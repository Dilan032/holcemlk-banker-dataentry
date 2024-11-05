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

// showinstitute List
router.post('/instituteList' ,instituteListController.instituteList);



// Export the router
module.exports = router;