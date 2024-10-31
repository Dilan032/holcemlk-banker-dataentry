const express = require('express');
const router = express.Router();

const saveDataController = require('./controllers/saveDataController');

// save all data from client
router.post('/save' ,saveDataController.saveData);

// Export the router
module.exports = router;