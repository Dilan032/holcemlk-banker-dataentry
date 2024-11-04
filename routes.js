const express = require('express');
const router = express.Router();

const savingAccountController = require('./controllers/saveDetails/savingAccountController');
const loanController = require('./controllers/saveDetails/loanController');
const fixedDepositController = require('./controllers/saveDetails/fixedDepositController');

// save all data from client
router.post('/savingAccSave' ,savingAccountController.savingAccSave);
router.post('/loanSave' ,loanController.loanSave);
router.post('/fixedDepositSave' ,fixedDepositController.fixedDepositSave);

// Export the router
module.exports = router;