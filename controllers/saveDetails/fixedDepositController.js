const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.fixedDepositSave = (req, res) => {
    const Data = req.body;

    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });

    }

    const requiredFields = ['AccountBalance', 'InterestRate', 'Period', 'OpenDate', 'CustomerID', 'LedgerName'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [Data.CustomerID], (error, result) => {
        if (error) return res.status(500).json({ message: 'Server error, please try again later' });
        if (result.length === 0) return res.status(404).json({ message: 'Customer ID is incorrect' });

        // Initialize (1/4)
        // forine key in systemusers table "pass as null " reason = systemusers table have not in this database
        const issued_field_officer = null;

        const OpenDate = Data.OpenDate;
        const Period = Data.Period;
        const AccountBalance = Data.AccountBalance;
        const CustomerID = Data.CustomerID;
        const AccountType = "F";
        const InterestRate = Data.InterestRate;
        const AccountLastTransactionDate = getDateAndTime();
        const LedgerName = Data.LedgerName;
        const PaidFDInterestAmount = Data.PaidFDInterestAmount || 0 ;

        // Calculate DueDate
        const OpenDateForCal = new Date(OpenDate);
        const dueMonths = parseInt(Period, 10);
        if (isNaN(OpenDateForCal.getTime()) || isNaN(dueMonths)) {
            return res.status(400).json({ message: 'Invalid Loan Start Date or Period provided' });
        }
        OpenDateForCal.setMonth(OpenDateForCal.getMonth() + dueMonths);
        const DueDate = OpenDateForCal.toISOString().split('T')[0];
        // console.log("DueDate :", DueDate);
        

        const FundAccount = null;
        const DepriciationAccount = null;
        const DebitAmount = "0.00";
        const CreditAmount = "0.00";
        const LoanStartDate = "null";
        const LoanFreeTime = "0";
        const InterestAmount = "0.00";
        const DueInterestAmount = "0.00";
        const ReservedInterest = "0.00";
        const PenaltyInterestPolicy = "0";
        const PenaltyRate = "0.000";
        const PenaltyInterestAmount = "0.00";
        const DepriciationPolicy = "0";
        const RequestedLoanAmount = "0.000";
        const DepriciationRate = "0.00";
        const ApprovedLoanAmount = "0.00";
        const JointAccountHolder1 = Data.JointAccountHolder1 || null;
        const JointAccountHolder2 = Data.JointAccountHolder2 || null;
        const JointAccountHolder3 = Data.JointAccountHolder3 || null;
        const LoanGuarantee1 = Data.LoanGuarantee1 || null;
        const LoanGuarantee2 = Data.LoanGuarantee2 || null;
        const LoanGuarantee3 = Data.LoanGuarantee3 || null;
        const LoanGuarantee4 = Data.LoanGuarantee4 || null;
        const PassdueType = "0";
        const PassdueInstallments = "0.00";
        const PassdueAmount = "0.00";
        const Active = "Y";
        const PrintedRecordNo = "0";
        const PageNo = "2";
        
        
        // Fetch ledgerID and Initialize ledgerID 
        db.query('SELECT LedgerID FROM ledgeraccounts WHERE LedgerName = ?', [LedgerName], (error, result) => {
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'Ledger not found (LedgerName not found)' });
            
            //Initialize ledgerID (2/4)
            const ledgerID = result[0].LedgerID;
            // console.log("Fetched LedgerID:", ledgerID); 

        // Fetch details for INSERT INTO ledgerdetails
        db.query('SELECT InterestAccount, PenaltyOrReservationAccount, MinimumAccountBalance, LowestAccountBalance, InterestPolicy, AccountType FROM ledgeraccounts WHERE AccountType IN (?) AND LedgerID = ?', ['FD', ledgerID], (error, result) => {
            // console.log("fetch ledgeraccounts details error: ",error);
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'Ledger not found' });

            // Initialize (3/4)
            const InterestAccount = result[0].InterestAccount;
            const PenaltyOrReservationAccount = result[0].PenaltyOrReservationAccount;
            const MinimumAccountBalance = result[0].MinimumAccountBalance;
            const LowestAccountBalance = result[0].LowestAccountBalance;
            const InterestPolicy = result[0].InterestPolicy;


                // Initialize (4/4)
                const HoldAmount = "0.00";
                const HoldDescription = "-";
                const FDUpdateOptionID = "03";

            
            // Check for JointAccountHolder 1 avelable or not in DB
            db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [JointAccountHolder1], (error, result) => {
                if (error) {
                    // console.log("LoanGuarantee1 : ",error);
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }

                if (JointAccountHolder1) {
                    if (result.length === 0) {
                        return res.status(400).json({ message: 'JointAccountHolder 1 not found' });
                    }
                    if(JointAccountHolder1 === CustomerID) {
                        return res.status(400).json({ message: 'JointAccountHolder 1 is same as CustomerID' });
                    }
                }

            // Check for JointAccountHolder 2 avelable or not in DB
            db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [JointAccountHolder2], (error, result) => {
                if (error) {
                    // console.log("LoanGuarantee1 : ",error);
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }

                if (JointAccountHolder2) {
                    if (result.length === 0) {
                        return res.status(400).json({ message: 'JointAccountHolder 2 not found' });
                    }
                    if(JointAccountHolder2 === CustomerID) {
                        return res.status(400).json({ message: 'JointAccountHolder 2 is same as CustomerID' });
                    }
                    if(JointAccountHolder1 === JointAccountHolder2) {
                        return res.status(400).json({ message: 'JointAccountHolder 1 is same as JointAccountHolder2' });
                    }
                }

            // Check for JointAccountHolder 3 avelable or not in DB
            db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [JointAccountHolder3], (error, result) => {
                if (error) {
                    // console.log("LoanGuarantee1 : ",error);
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }

                if (JointAccountHolder3) {
                    if (result.length === 0) {
                        return res.status(400).json({ message: 'JointAccountHolder 3 not found' });
                    }
                    if(JointAccountHolder3 === CustomerID) {
                        return res.status(400).json({ message: 'JointAccountHolder 3 is same as CustomerID' });
                    }
                    if(JointAccountHolder1 === JointAccountHolder2 || JointAccountHolder1 === JointAccountHolder3) {
                        return res.status(400).json({ message: 'JointAccountHolder 1 is same as JointAccountHolder 2 or JointAccountHolder 3' });
                    }
                    if(JointAccountHolder2 === JointAccountHolder3 || JointAccountHolder1 === JointAccountHolder3) {
                        return res.status(400).json({ message: 'JointAccountHolder 2 is same as JointAccountHolder 3' });
                    }
                }
            

            // Generate the next AccountNumber based on existing entries
            db.query(
                `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber
                 FROM ledgerdetails WHERE LedgerID = ?`,
                [ledgerID],
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
                    const AccountNumber = `${ledgerID}-` + nextAccountNumber.toString().padStart(5, '0');
                    // console.log("Generated AccountNumber:", AccountNumber); // Log for verification

                    db.query('SELECT AccountNumber FROM ledgerdetails WHERE AccountNumber = ?', [AccountNumber], (error, result) => {
                        if (error) return res.status(500).json({ message: 'Server error, please try again later' });
                        if (result.length > 0) return res.status(400).json({ message: 'This customer has already paid for this product' });


                        
                        db.query(
                            'INSERT INTO ledgerdetails (issued_field_officer, PaidFDInterestAmount, LedgerID, AccountNumber, CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, AccountLastTransactionDate, AccountBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)',
                            [issued_field_officer, PaidFDInterestAmount, ledgerID, AccountNumber, CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, OpenDate, AccountBalance],
                            (error, result) => {
                                if (error) return res.status(500).json({ message: 'Server error, please try again later' });

                                // consol log result show
                                console.log("Inserted Data:", {
                                    issued_field_officer, PaidFDInterestAmount, ledgerID, AccountNumber, CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, OpenDate, AccountBalance
                                });

                                res.status(200).json({ message: 'Client details inserted successfully' });
                            }
                        );
                    });
                }
            ); // end generate acc num query

            }); // end Check for JointAccountHolders
            }); // end Check for JointAccountHolders
            }); // end Check for JointAccountHolders

        // }); // end fetch MAX_OBTAINABLE_FDADVANCE_LOAN_PERCENTAGE
        }); // end Fetch details for INSERT INTO ledgerdetails
        }); // end Fetch ledgerID 
    });
};
