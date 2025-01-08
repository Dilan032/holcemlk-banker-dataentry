const db = require('../../../database');

exports.GSDivisionNoList = (req, res) => {

    db.query('SELECT GSDivisionNo FROM customerinformationprerequisite WHERE GSDivisionNo IS NOT NULL ORDER BY GSDivisionNo ASC', (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'GSDivisionNo list not found' });
        }

        // Return GSDivisionNo list
        res.status(200).json(result);
        
    });
}