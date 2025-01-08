const db = require('../../../database');

exports.ReligionList = (req, res) => {

    db.query('SELECT Religion FROM customerinformationprerequisite WHERE Religion IS NOT NULL', (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Religion list not found' });
        }

        // Return GSDivisionNo list
        res.status(200).json(result);
        
    });
}