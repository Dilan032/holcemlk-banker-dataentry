const db = require('../../database');

// Get Institute List using user input LedgerID
exports.getNextAccountNum = (req, res) => {
    const Data = req.body; // Get LedgerID 

    // Get LedgerID
    const LedgerID = Data.LedgerID;

    // Check if LedgerID is provided
    if ( LedgerID === undefined || LedgerID === null ) {
        console.log("LedgerID", LedgerID);
        
        return res.status(400).json({ message: 'Please provide LedgerID' });
    }

    // Generate the next AccountNumber based on existing entries
    db.query(
        `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber
        FROM ledgerdetails WHERE LedgerID = ?`,
        [LedgerID],
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
            const AccountNumber = `${LedgerID}-` + nextAccountNumber.toString().padStart(5, '0');
            console.log("Next Account Number", AccountNumber);

            res.status(200).json({ "Next Account Number": AccountNumber });
        });
}