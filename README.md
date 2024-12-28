<h1 align="center"> holcemlk banker data entry back-end </h1>

## Node.js packages
| `body-parser` | `dotenv` | `express` | `mysql2` | `nodemon` |

<hr>

Deploy backend
- `npm init -y` 
- `npm i body-parser dotenv express mysql2` 
- create .env file and add database details

<hr>

To run backend
- node app

<hr>
<br>

# End-points

## for save the client data
- /savingAccSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `LedgerName` , `OpenDate`
  
- /loanSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `LedgerName` , `Period` (int) , `IssuedLoanAmount` , `LoanStartDate` , `HoldAmount` , `LoanAccountType ('GNL','PWN' OR 'FDL')` , `AccountLastTransactionDate `

- /fixedDepositSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `LedgerName` ,  `InterestRate` , `Period` (int) , `OpenDate` , `AccountBalance`

## show Ledger Name list
- /SavingLedgerName  🙇‍♂️ |`get request`|
- /loanLedgerName  🙇‍♂️ |`get request`|
- /fixedDepoLedgerName  🙇‍♂️ |`get request`|

## show Customer Type
- /CustomerType 🙇‍♂️ |`get request`|

## show instituteList 
- /instituteList 🙇‍♂️ |`post request`| Input is required -> `LedgerID` , `LedgerName`

## search client name by entering client ID
- /searchClient 🙇‍♂️ |`post request`| Input is required -> `CustomerID`

## Show Current Account Details
- /currentAccountDetails 🙇‍♂️ |`post request`| Input is required -> `LedgerID` , `CustomerID`
