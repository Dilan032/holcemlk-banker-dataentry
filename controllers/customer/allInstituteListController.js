const db = require('../../database');

exports.allInstituteList = (req, res) => {

    db.query('SELECT InstituteID, InstituteName FROM instituteinformation', (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Institute list not found' });
        }

        // Return Institute information
        const institutes = result.map(row => ({ InstituteName: row.InstituteName, InstituteID: row.InstituteID }));
        res.status(200).json(institutes);
        
    });
}