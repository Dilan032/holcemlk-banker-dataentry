const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.loanSave = (req, res) => {
    const Data = req.body; // Get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Check request fields
    const requiredFields = [
        'LoanStartDate', 'InterestRate', 'Period', 'LoanGuarantee1',
        'LoanGuarantee2', 'IssuedLoanAmount', 'CustomerID', 'ledgerName', 'AccountLastTransactionDate', 'AccountBalance'
    ];

    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // Check if Customer ID exists
    db.query('SELECT CustomerID FROM customerinformation', (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        const customerExists = result.find(row => row.CustomerID === Data.CustomerID);
        if (!customerExists) {
            return res.status(404).json({ message: 'Client ID is incorrect' });
        }

        // Initialize required fields
        const {
            CustomerID,
            InterestRate,
            ledgerName,
            LoanGuarantee1,
            LoanGuarantee2,
            IssuedLoanAmount,
            LoanStartDate,
            Period,
            AccountLastTransactionDate,
            AccountBalance
        } = Data;
        const AccountType = "L";
        // const AccountLastTransactionDate = getDateAndTime(); // Not used

        // Calculate DueDate
        const loanStartDate = new Date(LoanStartDate);
        const dueMonths = parseInt(Period, 10);
        if (isNaN(loanStartDate.getTime()) || isNaN(dueMonths)) {
            return res.status(400).json({ message: 'Invalid Loan Start Date or Period provided' });
        }
        loanStartDate.setMonth(loanStartDate.getMonth() + dueMonths);
        const DueDate = loanStartDate.toISOString().split('T')[0];

        // Get LedgerID
        db.query('SELECT ledgerID FROM ledgeraccounts WHERE ledgerName = ?', [ledgerName], (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'Ledger not found' });
            }

            const ledgerID = result[0].ledgerID;

            // Generate next AccountNumber
            db.query(
                `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber 
                 FROM ledgerdetails WHERE LedgerID = ?`,
                [ledgerID],
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ message: 'Server error, please try again later' });
                    }

                    let nextAccountNumber = result[0].maxAccountNumber ? result[0].maxAccountNumber + 1 : 1;
                    if (nextAccountNumber > 99999) {
                        return res.status(400).json({ message: 'Account number limit reached' });
                    }

                    const AccountNumber = `${ledgerID}-` + nextAccountNumber.toString().padStart(5, '0');
                    console.log("Generated AccountNumber:", AccountNumber); // Log for verification

                    // Check for LoanGuarantee1 avelable or not in DB
                    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee1], (error, result) => {
                        if (error) {
                            console.log("LoanGuarantee2",error);
                            
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }
                        if (result.length === 0) {
                            return res.status(400).json({ message: 'Loan Guarantee 1 not found' });
                        }

                        // Check for LoanGuarantee2 avelable or not in DB
                    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee2], (error, result) => {
                        if (error) {
                            console.log("LoanGuarantee1",error);
                            
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }
                        if (result.length === 0) {
                            return res.status(400).json({ message: 'Loan Guarantee 2 not found' });
                        }

                        // check LoanGuarantee1 and LoanGuarantee2 equel or not
                        // if it is equel send an error
                        if(LoanGuarantee1 == LoanGuarantee2){
                            return res.status(400).json({ message: 'Loan Guarantee should not be the same' });
                        }

                        // if it is equel send an error
                        if(LoanGuarantee1 == CustomerID){
                            return res.status(400).json({ message: 'Guarantee and CustomerID should not be the same' });
                        }

                        // Insert client data to table
                        db.query(
                            'INSERT INTO ledgerdetails (CustomerID, AccountType, LoanStartDate, InterestRate, Period, DueDate, LoanGuarantee1, LoanGuarantee2, IssuedLoanAmount, AccountLastTransactionDate, ledgerID, AccountNumber, AccountBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [CustomerID, AccountType, LoanStartDate, InterestRate, Period, DueDate, LoanGuarantee1, LoanGuarantee2, IssuedLoanAmount, AccountLastTransactionDate, ledgerID, AccountNumber, AccountBalance],
                            (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                }
                                res.status(200).json({ message: 'Client details inserted successfully' });
                            }
                        );
                    }); // end Loan Guarantee 1 check query
                    }); // end Loan Guarantee 2 check query
                }
            );
        });
    });
};
