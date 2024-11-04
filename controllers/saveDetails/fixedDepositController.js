const db = require('../../database');

exports.savingAccSave = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // check type and request the feild
    if(!Data.AccountType){
        return res.status(400).json({ message: 'Place provided the Type ( S , F , L )' });
    }

    // S = saving account
    if(Data.AccountType === 'S'){
        if(!Data.AccountBalance){
            return res.status(400).json({ message: 'Place provided the Account Balance' });
        }else if(!Data.InterestRate){
            return res.status(400).json({ message: 'Place provided the Interest Rate' });
        }
    }
    
    // F = Fixed Deposit
    if(Data.AccountType === 'F' ){
        if(!Data.PaidFDInterestAmount){
            return res.status(400).json({ message: 'Place provided the Paid FD Interest Amount' });
        }else if(!Data.AccountBalance){
            return res.status(400).json({ message: 'Place provided the Account Balance' });
        }else if(!Data.InterestRate){
            return res.status(400).json({ message: 'Place provided the Interest Rate' });
        }else if(!Data.Period){
            return res.status(400).json({ message: 'Place provided the Period' });
        }
    }

    // L = Loan
    if(Data.AccountType === 'L' ){
        if(!Data.AccountBalance){
            return res.status(400).json({ message: 'Place provided the Paid FD Interest Amount' });
        }else if(!Data.LoanStartDate){
            return res.status(400).json({ message: 'Place provided the Account Balance' });
        }else if(!Data.InterestRate){
            return res.status(400).json({ message: 'Place provided the Interest Rate' });
        }else if(!Data.Period){
            return res.status(400).json({ message: 'Place provided the Period' });
        }else if(!Data.LoanGuarantee1){
            return res.status(400).json({ message: 'Place provided the LoanGuarantee1' });
        }else if(!Data.LoanGuarantee2){
            return res.status(400).json({ message: 'Place provided the LoanGuarantee2' });
        }
    }

    

    // Prepare query for dynamic insertion
    const fields = Object.keys(Data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(Data);

    let query = `INSERT INTO ledgerdetails (${fields.join(', ')}) VALUES (${placeholders})`;

    // Execute the query
    db.query(query, values, (error, result) => {
        if (error) {
            console.log(error);
            
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        res.status(200).json({
            message: 'Client details inserted successfully'
        });
    });
};
