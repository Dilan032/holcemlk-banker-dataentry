const db = require('../../database');

exports.currentAccountDetails = (req, res) => {
    const data = req.body;
    const inputCustomerID = data.CustomerID;
    const inputLedgerID = data.LedgerID;

    db.query(
        'SELECT * FROM ledgerdetails WHERE CustomerID = ? AND LedgerID = ?', [inputCustomerID, inputLedgerID], 
        (error, result) => {
            if (error) {  
                return res.status(500).json({ message: 'Server error, please try again later' });
            }
    
            if (result.length === 0) { 
                return res.status(404).json({ message: 'No account details available' });
            }
    
            res.status(200).json(result);
        }
    );
    
    
};
