<h1 align="center"> holcemlk banker data entry back-end </h1>

## Node.js packages
| `body-parser` | `dotenv` | `express` | `mysql2` | `nodemon` | `MD5`

<hr>

Deploy backend
- `npm init -y` 
- `npm i body-parser dotenv express mysql2 MD5` 
- create .env file and add database details

<hr>

To run backend
- node app

<hr>
<br>

# End-points

## for save the client data
- /savingAccSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `LedgerName` , `OpenDate` , `UserID`
  
- /loanSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `LedgerName` , `Period` (int) , `IssuedLoanAmount` , `LoanStartDate` , `HoldAmount` , `LoanAccountType ('GNL','PWN' OR 'FDL')` , `AccountLastTransactionDate ` , `UserID`

- /fixedDepositSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `LedgerName` ,  `InterestRate` , `Period` (int) , `OpenDate` , `AccountBalance` , `UserID`

## show Ledger Name list
- /SavingLedgerName  🙇‍♂️ |`get request`|
- /loanLedgerName  🙇‍♂️ |`get request`|
- /fixedDepoLedgerName  🙇‍♂️ |`get request`|

## show Customer Type
- /CustomerType 🙇‍♂️ |`get request`|

## show instituteList (requeried LedgerID)
- /instituteList 🙇‍♂️ |`post request`| Input is required -> `LedgerID` , `LedgerName`

## search client name by entering client ID
- /searchClient 🙇‍♂️ |`post request`| Input is required -> `CustomerID`

## Show Current Account Details
- /currentAccountDetails 🙇‍♂️ |`post request`| Input is required -> `LedgerID` , `CustomerID`


# customer reistration
- /customer-Register 🙇‍♂️ |`post request`| Input is required -> `customerType`, `customerTitle`, `referenceNumber`, `groupCode`, `customerName`, `customerFullName`, `homeNo`, `birthDay`, `nic`, `sex`, `joinedDate`, `sCustomerTitle`, `sCustomerName`, `sCustomerFullName`, `sHomeNo`, `beneficiaryNIC`

- /customer-info-update 🙇‍♂️ |`put request`| Input is required -> CustomerID
- /customer-info 🙇‍♂️ |`get request`| | Input is required -> CustomerID

## show all institute list without any user input
- /allInstituteList 🙇‍♂️ |`get request`|

## Authenticate
- /login 🙇‍♂️ |`post request`| Input is required -> `UserName` , `web_password`

## List for cus register
- /AGDivisionList 🙇‍♂️ |`get request`|
- /DistrictList 🙇‍♂️ |`get request`|
- /ReligionList 🙇‍♂️ |`get request`|

for GSDivision 👇<br> <br>
// get number of GSDivision 
- /GSDivisionNoList 🙇‍♂️ |`get request`|

// get name of GSDivision
- /GSDivisionNameList 🙇‍♂️ |`get request`|

// get name and number of GSDivision
- /GSDivisionList 🙇‍♂️ |`get request`|
