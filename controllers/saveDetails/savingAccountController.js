const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.savingAccSave = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Validate required fields
    const requiredFields = ['AccountBalance', 'InterestRate', 'CustomerID', 'ledgerName', 'OpenDate'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // Verify CustomerID existence
    db.query('SELECT CustomerID FROM customerinformation', (error, result) => {
        if (error) return res.status(500).json({ message: 'Server error, please try again later' });

        const customerExists = result.find(row => row.CustomerID === Data.CustomerID);
        if (!customerExists) return res.status(404).json({ message: 'Client ID is incorrect' });

        // Initialize values
        const { CustomerID, AccountBalance, InterestRate, ledgerName,OpenDate } = Data;
        const AccountType = "S";
        const AccountLastTransactionDate = getDateAndTime(); // Not used

        // Fetch ledgerID using ledgerName
        db.query('SELECT ledgerID FROM ledgeraccounts WHERE ledgerName = ?', [ledgerName], (error, result) => {
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'Ledger not found' });

            const ledgerID = result[0].ledgerID;

            // Generate next AccountNumber based on maxAccountNumber
            db.query(
                `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber 
                 FROM ledgerdetails WHERE LedgerID = ?`,
                [ledgerID],
                (error, result) => {
                    if (error) return res.status(500).json({ message: 'Server error, please try again later' });

                    let nextAccountNumber = (result[0].maxAccountNumber || 0) + 1;
                    if (nextAccountNumber > 99999) {
                        return res.status(400).json({ message: 'Account number limit reached' });
                    }

                    const AccountNumber = `${ledgerID}-` + nextAccountNumber.toString().padStart(5, '0');
                    console.log(AccountNumber);
                    
                    // Check for duplicate AccountNumber
                    db.query('SELECT AccountNumber FROM ledgerdetails WHERE AccountNumber = ?', [AccountNumber], (error, result) => {
                        if (error) return res.status(500).json({ message: 'Server error, please try again later' });

                        if (result.length > 0) {
                            return res.status(400).json({ message: 'This customer has already paid for this product' });
                        }

                        // Insert client data into ledgerdetails table
                        db.query(
                            'INSERT INTO ledgerdetails (CustomerID, AccountType, AccountBalance, InterestRate, ledgerID, AccountNumber,OpenDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [CustomerID, AccountType, AccountBalance, InterestRate, ledgerID, AccountNumber, OpenDate],
                            (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                }
                                res.status(200).json({ message: 'Client details inserted successfully' });
                            }
                        ); // end INSERT query
                    }); // end duplicate AccountNumber query
                }
            ); // end AccountNumber generation query
        }); // end ledgerID query
    }); // end CustomerID query
};
