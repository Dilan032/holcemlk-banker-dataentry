const db = require('../../../database');

exports.fixedDepoLedgerName = (req, res) => {
    const data = req.body;
    const InstituteID = data.InstituteID;

    if (!InstituteID) {
        return res.status(400).json({ message: 'Please provide the Institute ID to search products' });
    }

    const searchPattern = `${InstituteID}%`; // Match LedgerID starting with InstituteID

    const query = `
        SELECT LedgerName, LedgerID 
        FROM ledgeraccounts 
        WHERE (AccountType = ? ) 
        AND CAST(LedgerID AS CHAR) LIKE ?
    `;

    db.query(query, ['FD', searchPattern], (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Ledger Name not found' });
        }

        // Return Ledger Names
        const ledgerNames = result.map(row => ({ LedgerName: row.LedgerName, LedgerID: row.LedgerID }));
        res.status(200).json({ ledgerNames });
    });
};
