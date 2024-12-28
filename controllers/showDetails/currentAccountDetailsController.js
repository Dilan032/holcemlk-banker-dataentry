const db = require('../../database');

exports.currentAccountDetails = (req, res) => {
    const data = req.body;
    const inputCustomerID = data.CustomerID;
    const inputLedgerID = data.LedgerID;

    if (!inputCustomerID || !inputLedgerID) {
        return res.status(400).json({ message: 'CustomerID and LedgerID are required' });
    }    

    db.query(
        'SELECT AccountNumber, OpenDate, Period, InterestRate, AccountBalance FROM ledgerdetails WHERE CustomerID = ? AND LedgerID = ?', [inputCustomerID, inputLedgerID], 
        (error, response) => {
            if (error) {  
                return res.status(500).json({ message: 'Server error, please try again later' });
            }
    
            if (response.length === 0) { 
                return res.status(404).json({ message: 'No account details available' });
            }

        // Map over results to convert OpenDate to Sri Lankan time
        const result = response.map(accountDetails => {
            const utcTime = new Date(accountDetails.OpenDate);
            const sriLankanTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);
            
            return {
                AccountNumber: accountDetails.AccountNumber,
                OpenDate: sriLankanTime.toISOString().replace('T', ' ').slice(0, 19), // Formatted Sri Lankan time
                Period: accountDetails.Period,
                InterestRate: accountDetails.InterestRate,
                AccountBalance: accountDetails.AccountBalance
            };
        });

        // console.log(result);
        res.status(200).json(result);
        }
    );
    
    
};
