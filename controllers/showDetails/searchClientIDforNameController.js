const db = require('../../database');

exports.searchClient = (req, res) => {
    const data = req.body;
    const inputCustomerID = data.CustomerID;

    db.query( // show result regardin first letter
        'SELECT CustomerID, CustomerName FROM customerinformation WHERE CustomerID LIKE ?', [`${inputCustomerID}%`], 
        (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Customer Name details not found' });
            }

            res.status(200).json(result);
        }
    );
};
