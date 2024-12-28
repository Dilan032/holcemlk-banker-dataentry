const db = require('../../database');

exports.cusInfoUpdate = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Validate required fields
    const requiredFields = ['CustomerType', 'CustomerTitle', 'ReferenceNumber', 'GroupCode', 'CustomerName', 'CustomerFullName', 'HomeNo', 'BirthDay', 'NIC', 'Sex', 'JoinedDate', 'sCustomerTitle', 'sCustomerName', 'sCustomerFullName', 'sHomeNo', 'BeneficiaryNIC'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // UPDATE customer information
    db.query(
        `UPDATE customerinformation 
         SET 
            CustomerType = ?, CustomerTitle = ?, GroupCode = ?, SubGroupCode = ?, CustomerName = ?, 
            CustomerFullName = ?, HomeNo = ?, HomeStreet = ?, HomeTown = ?, HomeCountry = ?, 
            BussinessLocationNo = ?, BusinessStreet = ?, BussinessTown = ?, BussinessName = ?, 
            ImportantNote = ?, BirthDay = ?, NIC = ?, Sex = ?, PersonnalTelephoneNo = ?, 
            PersonnalMobileNo = ?, PersonnalEMail = ?, HomeTelephoneNo = ?, BusinessTelephoneNo = ?, 
            WebSite = ?, District = ?, AGDivision = ?, GSDivisionName = ?, GSDivisionNo = ?, 
            Religion = ?, JoinedDate = ?, AccountTransfereeName = ?, TransfereesRelationship = ?, 
            MemberStatus = ?, sCustomerTitle = ?, sCustomerName = ?, sCustomerFullName = ?, 
            sHomeNo = ?, sHomeStreet = ?, sHomeTown = ?, MaritalStatus = ?, CustomerAddress = ?, 
            sCustomerAddress = ?, BussinessAddress = ?, BeneficiaryNIC = ?, Occupation = ?, 
            ReferenceNumber = ?, InstituteId = ?, FPEnrollID = ?
         WHERE CustomerID = ?`,
        [
          customerType, customerTitle, groupCode, subGroupCode, customerName,
          customerFullName, homeNo, homeStreet, homeTown, homeCountry, businessLocationNo,
          businessStreet, businessTown, businessName, importantNote, birthDay, nic, sex,
          personnalTelephoneNo, personnalMobileNo, personnalEMail, homeTelephoneNo,
          businessTelephoneNo, webSite, district, agDivision, gsDivisionName, gsDivisionNo,
          religion, joinedDate, accountTransfereeName, transfereesRelationship, memberStatus,
          sCustomerTitle, sCustomerName, sCustomerFullName, sHomeNo, sHomeStreet, sHomeTown,
          maritalStatus, customerAddress, sCustomerAddress, businessAddress, beneficiaryNIC,
          occupation, referenceNumber, instituteId, fpEnrollID, customerID // `customerID` in WHERE
        ],
        (error, result) => {
          if (error) {
            console.error('Error updating customer information:', error);
            return;
          }
          console.log('Customer information updated successfully:', result);
        }
      );
      
      
};
