const db = require('../../database');

exports.CustomerType = (req, res) => {
    db.query('SELECT CustomerType FROM customerinformation', (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Customer Type not found' });
        }

        // Return Customer Types as an array
        const customerTypes = result.map(row => row.CustomerType);
        res.status(200).json({ customerTypes });
    });
};
