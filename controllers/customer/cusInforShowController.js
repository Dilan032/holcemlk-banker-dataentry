const db = require('../../database');

exports.cusInfoShow = (req, res) => {
    const cusID = req.body.CustomerID; // get data from client

    // Check if CustomerID is provided
    if (!cusID) {
        return res.status(400).json({ message: 'CustomerID is required' });
    }

    db.query('SELECT * FROM customerinformation WHERE CustomerID = ?', [cusID], (error, result) => {
        if (error) {
            console.error('Error getting customer information:', error);
            return;
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Customer information not found' });
        }
        
        res.status(200).json({ result });

    });
};