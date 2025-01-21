const db = require('../../database');

// Get Institute List 
exports.instituteList = (req, res) => {

    // Get Institute name
    db.query('SELECT InstituteName,InstituteID FROM instituteinformation WHERE SectionType = ?', ['BANK'], (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Institutes not found' });
        }

        // Return Institute information
        const ledgerNames = result.map(row => ({ InstituteName: row.InstituteName, InstituteID: row.InstituteID }));
        res.status(200).json(ledgerNames);
    });
        
};
