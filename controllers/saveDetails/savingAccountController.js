const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.savingAccSave = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Validate required fields
    const requiredFields = ['AccountBalance', 'InterestRate', 'CustomerID', 'LedgerName', 'OpenDate', 'UserID'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // Verify CustomerID existence
    db.query('SELECT CustomerID FROM customerinformation', (error, result) => {
        if (error) return res.status(500).json({ message: 'Server error, please try again later' });

        const customerExists = result.find(row => row.CustomerID === Data.CustomerID);
        if (!customerExists) return res.status(404).json({ message: 'Client ID is incorrect' });

        // Initialize values (1/2)
        const { CustomerID, AccountBalance, InterestRate, LedgerName, OpenDate } = Data;

        // loging officer ID
        const issued_field_officer = Data.UserID;

        const AccountType = "S";
        const AccountLastTransactionDate = getDateAndTime(); 
        const FundAccount = null;
        const DepriciationAccount = null;
        const DebitAmount = "0.00";
        const CreditAmount = "0.00";
        const HoldDescription = "-";
        const LoanStartDate = null;
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
            if (result.length === 0) return res.status(404).json({ message: 'Ledger ID not found' });
            
            //Initialize ledgerID (2/3)
            const ledgerID = result[0].LedgerID;
            // console.log("Fetched LedgerID:", ledgerID); 
        
        // Fetch details for INSERT INTO ledgerdetails
        db.query('SELECT InterestAccount, PenaltyOrReservationAccount, MinimumAccountBalance, LowestAccountBalance, InterestPolicy, AccountType FROM ledgeraccounts WHERE AccountType IN (?,?) AND LedgerID = ?', ['SV', 'IN', ledgerID], (error, result) => {
            if (error) return res.status(500).json({ message: 'Server error, please try again later' });
            if (result.length === 0) return res.status(404).json({ message: 'ledgeraccounts details not found' });

            // Initialize ledgerID (3/3)
            const InterestAccount = result[0].InterestAccount;
            const PenaltyOrReservationAccount = result[0].PenaltyOrReservationAccount;
            const MinimumAccountBalance = result[0].MinimumAccountBalance;
            const LowestAccountBalance = result[0].LowestAccountBalance;
            const HoldAmount = null;
            const FDUpdateOptionID = "0";
            const Period = null;
            const DueDate = null;
            const InterestPolicy = result[0].InterestPolicy;

            
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
                                return res.status(400).json({ message: 'JointAccountHolder 1 is same as JointAccountHolder2 or JointAccountHolder3' });
                            }
                            if(JointAccountHolder2 === JointAccountHolder3 || JointAccountHolder1 === JointAccountHolder3) {
                                return res.status(400).json({ message: 'JointAccountHolder 2 is same as JointAccountHolder 3' });
                            }
                        }

                        // Generate next AccountNumber based on maxAccountNumber
            db.query(
                `SELECT MAX(CAST(RIGHT(AccountNumber, 5) AS UNSIGNED)) AS maxAccountNumber 
                 FROM ledgerdetails WHERE LedgerID = ?`,
                [ledgerID],
                (error, result) => {
                    if (error) return res.status(500).json({ message: 'Server error, please try again later' });

                    let nextAccountNumber = (result[0].maxAccountNumber || 0) + 1;
                    if (nextAccountNumber > 99999) {
                        return res.status(400).json({ message: 'Account number limit reached' });
                    }

                    const AccountNumber = `${ledgerID}-` + nextAccountNumber.toString().padStart(5, '0');
                    console.log("Generate Acc Num: ",AccountNumber);
                    
                    // Check for duplicate AccountNumber 
                    db.query('SELECT AccountNumber FROM ledgerdetails WHERE AccountNumber = ?', [AccountNumber], (error, result) => {
                        if (error) return res.status(500).json(
                            { message: 'Server error, please try again later', error }
                        );
                        
                        if (result.length > 0) {
                            console.log(result);
                            return res.status(400).json(
                                { message: 'This customer has already paid for this product' }
                        );   
                        }
                        

                        // Insert client data into ledgerdetails table
                        db.query(
                            'INSERT INTO ledgerdetails (issued_field_officer, LedgerID, AccountNumber, CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, AccountLastTransactionDate, AccountBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)',
                            [issued_field_officer, ledgerID, AccountNumber,CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, OpenDate, AccountBalance],
                            (error, result) => {
                                if (error) {
                                    console.log("Insert client data into ledgerdetails table query: ",error);
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                }

                                // consol log result show
                                console.log("Inserted Data:", {
                                    issued_field_officer, ledgerID, AccountNumber, CustomerID, InterestAccount, PenaltyOrReservationAccount, FundAccount, DepriciationAccount, DebitAmount, CreditAmount, MinimumAccountBalance, LowestAccountBalance, HoldAmount, HoldDescription, Period, OpenDate, DueDate, LoanStartDate, LoanFreeTime, InterestPolicy, InterestRate, InterestAmount, DueInterestAmount, ReservedInterest, PenaltyInterestPolicy, PenaltyRate, PenaltyInterestAmount, DepriciationPolicy, DepriciationRate, RequestedLoanAmount, ApprovedLoanAmount, JointAccountHolder1, JointAccountHolder2, JointAccountHolder3, LoanGuarantee1, LoanGuarantee2, LoanGuarantee3, LoanGuarantee4, AccountType, PassdueType, PassdueInstallments, PassdueAmount, Active, PrintedRecordNo, PageNo, FDUpdateOptionID, OpenDate, AccountBalance
                                });

                                res.status(200).json({ message: 'Client details inserted successfully', success: true, AccountNumber: AccountNumber , CustomerID: CustomerID});
             
                            }
                        ); // end INSERT query
                    }); // end JointAccountHolder query
                    }); // end JointAccountHolder query
                    }); // end JointAccountHolder query
                    }); // end duplicate AccountNumber query
                }
            ); // end AccountNumber generation query
        }); // end ledgerID query
        }); // end Fetch details for INSERT INTO ledgerdetails
    }); // end CustomerID query
};
