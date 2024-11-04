const db = require('../../database');

// Module for getting all Customer details
exports.instituteList = (req, res) => {
    const ledgeraccount = req.body; // Get user input from user

    // Get InstituteID
    db.query('SELECT InstituteID FROM ledgeraccounts WHERE LedgerID = ?', [ledgeraccount.LedgerID], (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Institute id not found' });
        }

        const instituteID = result[0].InstituteID;

        // Get Institute name
        db.query('SELECT InstituteName FROM instituteinformation WHERE InstituteID = ?', [instituteID], (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Institute Name not found' });
            }

            // Return Institute information
            // res.status(200).json(result[0]);
            res.status(200).json(result);
        });
    });
};
