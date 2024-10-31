const express = require('express');
const router = express.Router();

const saveDataController = require('./controllers/saveDataController');

router.post('/' ,saveDataController.saveData);

// Export the router
module.exports = router;