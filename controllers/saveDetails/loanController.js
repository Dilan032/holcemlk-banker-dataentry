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
        'HoldAmount', 'LoanAccountType','LoanStartDate', 'InterestRate', 'Period', 
         'IssuedLoanAmount', 'CustomerID', 'LedgerName', 'AccountLastTransactionDate', 'AccountBalance', 'UserID'
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

        // Initialize required fields (1/3)
        const {
            LoanAccountType,
            CustomerID,
            InterestRate,
            LedgerName,
            IssuedLoanAmount,
            LoanStartDate,
            Period,
            AccountLastTransactionDate,
            AccountBalance
        } = Data;

        
        // const AccountLastTransactionDate = getDateAndTime(); // Not used
        // const FundAccount = null;
        // const OpenDate == LoanStartDate; this Initialize in last insert query

        const HoldFDAccount = Data.HoldFDAccount || null; // FD acc num for if it is FD_Loan
        const HoldAmount = Data.HoldAmount || "0.00";
        const HoldDescription = "-";

        const AccountType = "L";
        const LoanFreeTime = "0";
        const Active = "Y";
        const LoanApprovalStatus = "Loan Issued";
        const PassBookType = "PB";
        const PrintedRecordNo = "0";
        const PageNo = "2";
        const pawn_MarketValue = "0.00";
        const pawn_EstimatedAmount = "0.00";
        const pawn_PaymentAmount = "0.00";
        const pawn_ItemTotalWeight = "0.00";
        const pawn_ItemGoldWeight = "0.00";
        const LoanGuarantee1 = Data.LoanGuarantee1 || null; // get from user input
        const LoanGuarantee2 = Data.LoanGuarantee2 || null;
        const LoanGuarantee3 = Data.LoanGuarantee3 || null;
        const LoanGuarantee4 = Data.LoanGuarantee4 || null;


        // Calculate DueDate and Initialize
        const loanStartDate = new Date(LoanStartDate);
        const dueMonths = parseInt(Period, 10);
        if (isNaN(loanStartDate.getTime()) || isNaN(dueMonths)) {
            return res.status(400).json({ message: 'Invalid Loan Start Date or Period provided' });
        }
        loanStartDate.setMonth(loanStartDate.getMonth() + dueMonths);
        const DueDate = loanStartDate.toISOString().split('T')[0];
        // console.log("DueDate : ", DueDate);
        

        // Get LedgerID and Initialize ledgerID for INSERT INTO ledgerdetails
        db.query('SELECT LedgerID FROM ledgeraccounts WHERE LedgerName = ?', [LedgerName], (error, result) => {
            if (error) { 
                return res.status(500).json({ message: 'Server error, please try again later' }); 
            }
            if (result.length === 0) { 
                return res.status(404).json({ message: 'Ledger ID not found' }); 
            }
                
            // Initialize ledgerID (2/3)
            const ledgerID = result[0].LedgerID;
            

        // Fetch details for INSERT INTO ledgerdetails
        db.query('SELECT LedgerID, LedgerName, InterestAccount, PenaltyOrReservationAccount, MinimumAccountBalance, LowestAccountBalance, InterestPolicy, AccountType, LoanPassduePolicy, PenaltyRate, PenaltyPolicy, PenaltyOrReservationAccount FROM ledgeraccounts WHERE AccountType IN (?,?,?) AND LedgerID = (?)', ['GNL','PWN','FDL', ledgerID], (error, result) => {
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'Ledger not found' });

            // Initialize ledgerID (3/3)
            const LoanApplicationNo = "-";
            const InterestAccount = result[0].InterestAccount;
            const LoanInstallment = IssuedLoanAmount/Period;
            const InterestPolicy = result[0].InterestPolicy;
            const PassdueType = "-";
            const PenaltyRate = result[0].PenaltyRate;
            const PenaltyInterestPolicy = result[0].PenaltyInterestPolicy;
            const PenaltyOrReservationAccount = result[0].PenaltyOrReservationAccount;

            const LoanApprovedDate = LoanStartDate;
            // login officer ID
            const LoanApprovedBy = Data.UserID;
            const pawn_Reason = "-";
            const StationaryCharge = "-";
            const LoanReasonID = "-";


                    // Check for LoanGuarantee1 avelable or not in DB
                    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee1], (error, result) => {
                        if (error) {
                            // console.log("LoanGuarantee1 : ",error);
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }

                        if (LoanGuarantee1) {
                            if (result.length === 0) {
                                return res.status(400).json({ message: 'LoanGuarantee1 not found' });
                            }

                            if(LoanGuarantee1 === CustomerID){
                                return res.status(400).json({ message: 'Guarantee 1 and CustomerID should not be the same' });
                            }
                        }

                    // Check for LoanGuarantee2 avelable or not in DB
                    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee2], (error, result) => {
                        if (error) {
                            // console.log("LoanGuarantee2 : ",error); 
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }
                        if (LoanGuarantee2) {
                            if (result.length === 0) {
                                return res.status(400).json({ message: 'LoanGuarantee 2 not found' });
                            }

                            if(LoanGuarantee1 === LoanGuarantee2){
                                return res.status(400).json({ message: 'Loan LoanGuarantee 1 and LoanGuarantee 2 should not be the same' });
                            }

                            if(LoanGuarantee2 === CustomerID){
                                return res.status(400).json({ message: 'Guarantee 2 and CustomerID should not be the same' });
                            }
                        }

                    // Check for LoanGuarantee3 avelable or not in DB
                    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee3], (error, result) => {
                        if (error) {
                            // console.log("LoanGuarantee3 : ",error); 
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }
                        if (LoanGuarantee3) {
                            
                            if (result.length === 0) {
                                return res.status(400).json({ message: 'LoanGuarantee3 not found' });
                            }

                            if(LoanGuarantee1 === LoanGuarantee3){
                                return res.status(400).json({ message: 'Loan Guarantee 1 and Guarantee 3 should not be the same' });
                            }
                            if(LoanGuarantee2 === LoanGuarantee3){
                                return res.status(400).json({ message: 'Loan Guarantee 2 and Guarantee 3 should not be the same' });
                            }

                            if(LoanGuarantee3 === CustomerID){
                                return res.status(400).json({ message: 'Guarantee 3 and CustomerID should not be the same' });
                            }
                        }

                        // Check for LoanGuarantee4 avelable or not in DB
                        db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [LoanGuarantee4], (error, result) => {
                            if (error) {
                                // console.log("LoanGuarantee4 : ",error); 
                                return res.status(500).json({ message: 'Server error, please try again later' });
                            }
                            if (LoanGuarantee4) {
                                if (result.length === 0) {
                                    return res.status(400).json({ message: 'LoanGuarantee4 not found' });
                                }
                                if(LoanGuarantee1 === LoanGuarantee4){
                                    return res.status(400).json({ message: 'Loan Guarantee 1 and Guarantee 4 should not be the same' });
                                }
                                if(LoanGuarantee2 === LoanGuarantee4){
                                    return res.status(400).json({ message: 'Loan Guarantee 2 and Guarantee 4 should not be the same' });
                                }
                                if(LoanGuarantee3 === LoanGuarantee4){
                                    return res.status(400).json({ message: 'Loan Guarantee 3 and Guarantee 4 should not be the same' });
                                }
    
                                if(LoanGuarantee4 === CustomerID){
                                    return res.status(400).json({ message: 'Guarantee 4 and CustomerID should not be the same' });
                                }

                            }

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
                            // console.log("Generated AccountNumber:", AccountNumber); // Log for verification


                        // Insert client data to table
                        db.query(
                            'INSERT INTO ledgerdetails (LedgerID, AccountNumber, LoanApplicationNo, CustomerID, InterestAccount, AccountBalance, IssuedLoanAmount, LoanInstallment, Period, OpenDate, DueDate, AccountLastTransactionDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, AccountType, LoanAccountType, PassdueType, Active, LoanApprovalStatus, LoanApprovedDate, LoanApprovedBy, PassBookType, PrintedRecordNo, PageNo, pawn_MarketValue, pawn_EstimatedAmount, pawn_PaymentAmount, pawn_Reason, pawn_ItemTotalWeight, pawn_ItemGoldWeight, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, StationaryCharge, LoanReasonID, PenaltyRate, PenaltyInterestPolicy, HoldFDAccount, HoldAmount, HoldDescription, PenaltyOrReservationAccount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [ledgerID, AccountNumber, LoanApplicationNo, CustomerID, InterestAccount, AccountBalance, IssuedLoanAmount, LoanInstallment, Period, LoanStartDate, DueDate, AccountLastTransactionDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, AccountType, LoanAccountType, PassdueType, Active, LoanApprovalStatus, LoanApprovedDate, LoanApprovedBy, PassBookType, PrintedRecordNo, PageNo, pawn_MarketValue, pawn_EstimatedAmount, pawn_PaymentAmount, pawn_Reason, pawn_ItemTotalWeight, pawn_ItemGoldWeight, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, StationaryCharge, LoanReasonID, PenaltyRate, PenaltyInterestPolicy, HoldFDAccount, HoldAmount, HoldDescription, PenaltyOrReservationAccount],
                            (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                }

                                // consol log result show
                                console.log("Inserted Data:", {
                                    ledgerID, AccountNumber, LoanApplicationNo, CustomerID, InterestAccount, AccountBalance, IssuedLoanAmount, LoanInstallment, Period, LoanStartDate, DueDate, AccountLastTransactionDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, AccountType, LoanAccountType, PassdueType, Active, LoanApprovalStatus, LoanApprovedDate, LoanApprovedBy, PassBookType, PrintedRecordNo, PageNo, pawn_MarketValue, pawn_EstimatedAmount, pawn_PaymentAmount, pawn_Reason, pawn_ItemTotalWeight, pawn_ItemGoldWeight, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, StationaryCharge, LoanReasonID, PenaltyRate, PenaltyInterestPolicy, HoldFDAccount, HoldAmount, HoldDescription, PenaltyOrReservationAccount
                                });

                                res.status(200).json({ message: 'Client details inserted successfully', success: true, AccountNumber: AccountNumber , CustomerID: CustomerID });
                            }
                        );
                    }); // end Loan Guarantee 1 check query
                    }); // end Loan Guarantee 2 check query
                    }); // end Loan Guarantee 3 check query
                    }); // end Loan Guarantee 4 check query
                }
            );
        }); // end Fetch details for INSERT INTO ledgerdetails
        });
    });
};
