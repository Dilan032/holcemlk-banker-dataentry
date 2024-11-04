const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.loanSave = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // check request the feild
    if(!Data.LoanStartDate){
        return res.status(400).json({ message: 'Place provided the Loan Start Date' });
    }
    if(!Data.InterestRate){
        return res.status(400).json({ message: 'Place provided the Interest Rate' });
    }
    if(!Data.Period){
        return res.status(400).json({ message: 'Place provided the Period' });
    }
    if(!Data.LoanGuarantee1){
        return res.status(400).json({ message: 'Place provided the LoanGuarantee 1' });
    }
    if(!Data.LoanGuarantee2){
        return res.status(400).json({ message: 'Place provided the LoanGuarantee 2' });
    }
    if(!Data.IssuedLoanAmount){
        return res.status(400).json({ message: 'Place provided the Issued Loan Amount' });
    }
    if(!Data.LoanStartDate){
        return res.status(400).json({ message: 'Place provided the Loan Start Date' });
    }
    if(!Data.IssuedLoanAmount){
        return res.status(400).json({ message: 'Place provided the Issued Loan Amount' });
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
            const AccountType = "L";
            const InterestRate = Data.InterestRate;
            const AccountLastTransactionDate = getDateAndTime(); // getDateAndTime function in (functions/dateAndTime) 
            const ledgerName = Data.ledgerName; // this is for get the ledgerID
            const LoanGuarantee1 = Data.LoanGuarantee1;
            const LoanGuarantee2 = Data.LoanGuarantee2;
            const IssuedLoanAmount = Data.IssuedLoanAmount;
            const LoanStartDate = Data.LoanStartDate;

            const loanStartDate = new Date(Data.LoanStartDate); // Convert LoanStartDate to a Date object
const dueMonths = parseInt(Data.Period, 10); // Ensure DueDate is a number

// Check if loanStartDate is valid
if (isNaN(loanStartDate.getTime())) {
    console.error("Invalid Loan Start Date");
    return res.status(400).json({ message: 'Invalid Loan Start Date provided' });
}

if (isNaN(dueMonths)) {
    console.error("Invalid Period");
    return res.status(400).json({ message: 'Invalid Period provided' });
}

// Add the due months to the loan start date
loanStartDate.setMonth(loanStartDate.getMonth() + dueMonths);

// Format the DueDate as a string (e.g., 'YYYY-MM-DD')
const DueDate = loanStartDate.toISOString().split('T')[0];
console.log("Calculated Due Date:", DueDate);




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
                        db.query('INSERT INTO ledgerdetails (CustomerID, AccountType, LoanStartDate, InterestRate, Period, DueDate, LoanGuarantee1, LoanGuarantee2, IssuedLoanAmount, AccountLastTransactionDate, ledgerID, AccountNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [CustomerID, AccountType, loanStartDate, InterestRate, dueMonths, DueDate, LoanGuarantee1, LoanGuarantee2, IssuedLoanAmount, AccountLastTransactionDate, ledgerID, AccountNumber],
                            (error, result) => {
                                if (error) {
                                    console.log(error);
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
