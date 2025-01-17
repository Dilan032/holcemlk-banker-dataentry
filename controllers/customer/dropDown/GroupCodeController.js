const db = require('../../../database');

exports.GroupCodeDetails = (req, res) => {

    db.query('SELECT GroupCode, GroupName FROM customergroup', (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'GroupCode, GroupName list not found' });
        }

        // Return GSDivisionNo list
        res.status(200).json(result);
        
    });
}