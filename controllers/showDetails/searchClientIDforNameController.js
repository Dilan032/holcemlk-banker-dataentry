const db = require('../../database');

exports.searchClient = (req, res) => {
    const data = req.body;
    const inputCustomerID = data.CustomerID;

    // Check if Customer ID is provided
    if (!inputCustomerID) {
        return res.status(400).json({ message: 'Please provide the Customer ID to search' });
    }

    // fetch MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE
    db.query('SELECT MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE from applicationsettings WHERE id = ?', ['1'], (error, LOAN_PERCENTAGE_result) => {
        
        // console.log("fetch MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE details error: ",error);
        
        if (error) return res.status(500).json({ message: 'Server error, please try again later' });
        if (LOAN_PERCENTAGE_result.length === 0) return res.status(404).json({ message: 'MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE not found' });

        const LOAN_PERCENTAGE = LOAN_PERCENTAGE_result[0].MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE;
        // const HoldAmount = AccountBalance * 100 / LOAN_PERCENTAGE; 
        // HoldAmount calculate in frontend for FD_LOAN


    // get customer FD ACCOUNT Details (if it is has)
    db.query(
        'SELECT AccountNumber, AccountBalance FROM ledgerdetails WHERE CustomerID LIKE ? AND AccountBalance > 0.00',
        [`${inputCustomerID}%`],
        (error, FDAccountDetailsResult) => {

            // console.log("get customer FD ACCOUNT Details error", error);

            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (FDAccountDetailsResult.length === 0) {
                return res.status(404).json({ message: 'Customer information not found' });
            }


    // get customer information
    db.query(
        'SELECT CustomerID, CustomerName FROM customerinformation WHERE CustomerID LIKE ?',
        [`${inputCustomerID}%`],
        (error, customerResult) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (customerResult.length === 0) {
                return res.status(404).json({ message: 'Customer information not found' });
            }

            // get ledger details
            db.query(
                'SELECT * FROM ledgerdetails WHERE CustomerID LIKE ?',
                [`${inputCustomerID}%`],
                (error, ledgerResult) => {
                    if (error) {
                        return res.status(500).json({ message: 'Server error, please try again later' });
                    }

                    if (ledgerResult.length === 0) {
                        return res.status(404).json({ message: 'Ledger details not found' });
                    }

                    // Combine results
                    res.status(200).json({
                        LOAN_PERCENTAGE_FOR_FD: LOAN_PERCENTAGE_result,
                        FD_Account_Details: FDAccountDetailsResult,
                        customer_Information: customerResult,
                        ledger_Details: ledgerResult,
                    });
                }
            );
         }); // end get customer FD ACCOUNT Details (if it is has)
         }); // end fetch MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE
        }
    );
};
