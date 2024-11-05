<h1 align="center"> holcemlk banker data entry back-end </h1>

## Node.js packages
| `body-parser` | `dotenv` | `express` | `mysql2` |

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
- /savingAccSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `ledgerName` 
  
- /loanSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `AccountBalance` , `InterestRate` , `ledgerName` , `LoanGuarantee1` , `LoanGuarantee2` , `Period` (int) , `IssuedLoanAmount` , `LoanStartDate` 

- /fixedDepositSave 🙇‍♂️ |`post request`| Input is required -> `CustomerID` , `ledgerName` , `PaidFDInterestAmount` , `InterestRate` , `Period` (int) , `OpenDate` 

  <br>
