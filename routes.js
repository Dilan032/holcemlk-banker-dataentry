const express = require('express');
const router = express.Router();

const savingAccountController = require('./controllers/saveDetails/savingAccountController');

// save all data from client
router.post('/savingAccSave' ,savingAccountController.savingAccSave);

// Export the router
module.exports = router;