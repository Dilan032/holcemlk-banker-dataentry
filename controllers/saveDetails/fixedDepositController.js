const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.fixedDepositSave = (req, res) => {
    const Data = req.body;

    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    const requiredFields = ['AccountBalance', 'InterestRate', 'Period', 'OpenDate', 'CustomerID', 'ledgerName'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [Data.CustomerID], (error, result) => {
        if (error) return res.status(500).json({ message: 'Server error, please try again later' });
        if (result.length === 0) return res.status(404).json({ message: 'Customer ID is incorrect' });

        const AccountBalance = Data.CustomerID;
        const CustomerID = Data.CustomerID;
        const AccountType = "F";
        const InterestRate = Data.InterestRate;
        const AccountLastTransactionDate = getDateAndTime();
        const ledgerName = Data.ledgerName;

        db.query('SELECT ledgerID FROM ledgeraccounts WHERE ledgerName = ?', [ledgerName], (error, result) => {
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'Ledger not found' });

            const ledgerID = result[0].ledgerID;
            console.log("Fetched LedgerID:", ledgerID); // Log for verification

            // Generate the next AccountNumber based on existing entries
            db.query(
                `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber
                 FROM ledgerdetails WHERE LedgerID = ?`,
                [ledgerID],
                (error, result) => {
                    if (error) return res.status(500).json({ message: 'Server error, please try again later' });

                    // If no result is found, start from 1
                    let nextAccountNumber = 1;
                    if (result.length > 0 && result[0].maxAccountNumber) {
                        nextAccountNumber = result[0].maxAccountNumber + 1;
                    }

                    // Ensure the next account number is within the 5-digit limit (i.e., 00001 - 99999)
                    if (nextAccountNumber > 99999) {
                        return res.status(400).json({ message: 'Account number limit reached' });
                    }

                    // Format the next account number as "LedgerID-00001"
                    const AccountNumber = `${ledgerID}-` + nextAccountNumber.toString().padStart(5, '0');
                    console.log("Generated AccountNumber:", AccountNumber); // Log for verification

                    db.query('SELECT AccountNumber FROM ledgerdetails WHERE AccountNumber = ?', [AccountNumber], (error, result) => {
                        if (error) return res.status(500).json({ message: 'Server error, please try again later' });
                        if (result.length > 0) return res.status(400).json({ message: 'This customer has already paid for this product' });

                        db.query(
                            'INSERT INTO ledgerdetails (AccountBalance, CustomerID, AccountType, InterestRate, AccountLastTransactionDate, ledgerID, AccountNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [AccountBalance, CustomerID, AccountType, InterestRate, AccountLastTransactionDate, ledgerID, AccountNumber],
                            (error, result) => {
                                if (error) return res.status(500).json({ message: 'Server error, please try again later' });
                                res.status(200).json({ message: 'Client details inserted successfully' });
                            }
                        );
                    });
                }
            );
        });
    });
};
