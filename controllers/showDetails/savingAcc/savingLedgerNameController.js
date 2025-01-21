const db = require('../../../database');

exports.savingAccLedgerName = (req, res) => {
    const data = req.body;
    const InstituteID = data.InstituteID;

    if (!InstituteID) {
        return res.status(400).json({ message: 'Please provide the Institute ID to search products' });
    }

    const searchPattern = `${InstituteID}%`; // Match LedgerID starting with InstituteID

    const query = `
        SELECT LedgerName, LedgerID 
        FROM ledgeraccounts 
        WHERE (AccountType = ? OR AccountType = ?) 
        AND CAST(LedgerID AS CHAR) LIKE ?
    `;

    db.query(query, ['SV','IN', searchPattern], (error, result) => {
        if (error) {
            console.log("savingAccLedgerName error",error);
            
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            console.log("savingAccLedgerName result",result);
            
            return res.status(404).json({ message: 'Ledger Name not found' });
        }

        // Return Ledger Names
        const ledgerNames = result.map(row => ({ LedgerName: row.LedgerName, LedgerID: row.LedgerID }));
        res.status(200).json({ ledgerNames });
    });
};
