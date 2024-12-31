const db = require('../../../database');

exports.loanLedgerName = (req, res) => {
    db.query('SELECT LedgerName, LedgerID, AccountType FROM ledgeraccounts WHERE AccountType = ? OR AccountType = ?', ['GNL', 'FDL'], (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Ledger Name not found' });
        }

        // Return Ledger Names
        const ledgerNames = result.map(row => ({ LedgerName: row.LedgerName, LedgerID: row.LedgerID, AccountType: row.AccountType }));
        console.log(ledgerNames);
        
        res.status(200).json({ ledgerNames });
    });
};
