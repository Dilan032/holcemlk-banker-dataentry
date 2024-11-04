const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.fixedDepositSave = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // check request the feild
    if(!Data.PaidFDInterestAmount){
        return res.status(400).json({ message: 'Place provided the Paid FD Interest Amount' });
    }
    if(!Data.InterestRate){
        return res.status(400).json({ message: 'Place provided the Account Interest Rate' });
    }
    if(!Data.Period){
        return res.status(400).json({ message: 'Place provided the Period' });
    }
    if(!Data.OpenDate){
        return res.status(400).json({ message: 'Place provided the Open Date' });
    }
    if(!Data.CustomerID){
        return res.status(400).json({ message: 'Place provided the Customer ID' });
    }
    if(!Data.ledgerName){
        return res.status(400).json({ message: 'Place provided the ledger Name' });
    }

    // check the customer ID avalable or not
    db.query('SELECT CustomerID FROM customerinformation',(error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }
        
        // Find the customer ID in the result
        const customerExists = result.find(row => row.CustomerID === Data.CustomerID);

        if (!customerExists) {
            return res.status(404).json({ message: 'Client ID is incorrect' });
        }

            //insert data
            const CustomerID = Data.CustomerID;
            const AccountType = "F";
            const AccountBalance = Data.AccountBalance;
            const InterestRate = Data.InterestRate;
            const AccountLastTransactionDate = getDateAndTime(); // getDateAndTime function in (functions/dateAndTime) 
            const ledgerName = Data.ledgerName; // this is for get the ledgerID

            // get LedgerID 
            db.query('SELECT ledgerID FROM ledgeraccounts WHERE ledgerName = ?',[ledgerName],(error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }
                // Ensure that the result has a ledgerID
                if (result.length > 0) {
                    const ledgerID = result[0].ledgerID;

                    // create account number
                    const lastFiveDigits = CustomerID.slice(-5); // get lastFiveDigits in CustomerID
                    const AccountNumber = `${ledgerID}-${lastFiveDigits}`;

                    // Check for duplicate AccountNumber
                    db.query('SELECT AccountNumber FROM ledgerdetails WHERE AccountNumber = ?', [AccountNumber], (error, result) => {
                        if (error) {
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }

                        if (result.length > 0) {
                            // AccountNumber already exists
                            return res.status(400).json({ message: 'This customer has already paid for this product' });
                        }

                        //insert client data to table
                        db.query('INSERT INTO ledgerdetails (CustomerID, AccountType, InterestRate, AccountLastTransactionDate, ledgerID, AccountNumber) VALUES (?, ?, ?, ?, ?, ?)',
                            [CustomerID, AccountType, InterestRate, AccountLastTransactionDate, ledgerID, AccountNumber],
                            (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                } else {
                                    res.status(200).json({
                                        message: 'Client details inserted successfully'
                                    });
                                }
                            }
                        ); // end INSERT query

                    }); // end duplicate AccountNumber query    

                } else {
                    res.status(404).json({ message: 'Ledger not found' });
                }
                
            });// end LedgerID SELECT query
            
    }); // customer ID query
    
};
