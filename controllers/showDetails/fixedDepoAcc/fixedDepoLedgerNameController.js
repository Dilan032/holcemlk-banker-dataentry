const db = require('../../../database');

exports.fixedDepoLedgerName = (req, res) => {
    db.query('SELECT LedgerName FROM ledgeraccounts WHERE AccountType = ?', ['F'], (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Ledger Name not found' });
        }

        // Return Ledger Names
        const ledgerNames = result.map(row => row.LedgerName);
        res.status(200).json({ ledgerNames });
    });
};
