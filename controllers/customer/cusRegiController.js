const db = require('../../database');

exports.cusRegister = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Validate required fields
    const requiredFields = ['customerID', 'customerType', 'customerTitle', 'referenceNumber', 'groupCode', 'customerName', 'customerFullName', 'homeNo', 'birthDay', 'nic', 'sex', 'joinedDate', 'sCustomerTitle', 'sCustomerName', 'sCustomerFullName', 'sHomeNo', 'beneficiaryNIC'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // initialize variables
    customerID = Data.customerID; 
    customerType = Data.customerType; 
    customerTitle = Data.customerTitle;
    referenceNumber = Data.referenceNumber;
    groupCode = Data.groupCode;
    customerName = Data.customerName;
    customerFullName = Data.customerFullName; 
    homeNo = Data.homeNo;
    birthDay = Data.birthDay;
    nic = Data.nic;
    sex = Data.sex;
    joinedDate = Data.joinedDate;
    sCustomerTitle = Data.sCustomerTitle;
    sCustomerName = Data.sCustomerName;
    sCustomerFullName = Data.sCustomerFullName;
    sHomeNo = Data.sHomeNo;
    beneficiaryNIC = Data.beneficiaryNIC;

    const subGroupCode = Data.SubGroupCode || null;
    const homeStreet = Data.homeStreet || null;
    const homeTown = Data.homeTown || null;
    const homeCountry = Data.homeCountry || null;
    const businessLocationNo = Data.businessLocationNo || null;
    const businessStreet = Data.businessStreet || null;
    const businessTown = Data.businessTown || null;
    const businessName = Data.businessName || null;
    const importantNote = Data.importantNote || null;
    const personnalTelephoneNo = Data.personnalTelephoneNo || null;
    const personnalMobileNo = Data.personnalMobileNo || null;
    const personnalEMail = Data.personnalEMail || null;
    const homeTelephoneNo = Data.homeTelephoneNo || null;
    const businessTelephoneNo = Data.businessTelephoneNo || null;
    const webSite = Data.webSite || null;
    const district = Data.district || null;
    const agDivision = Data.agDivision || null;
    const gsDivisionName = Data.gsDivisionName || null;
    const gsDivisionNo = Data.gsDivisionNo || null;
    const religion = Data.religion || null;
    const accountTransfereeName = Data.accountTransfereeName || null;
    const transfereesRelationship = Data.transfereesRelationship || null;
    const maritalStatus = Data.maritalStatus || null;
    const sHomeStreet = Data.sHomeStreet || null;
    const sHomeTown = Data.sHomeTown || null;
    const memberStatus = Data.memberStatus || null;
    const customerAddress = Data.customerAddress || null;
    const sCustomerAddress = Data.sCustomerAddress || null;
    const businessAddress = Data.businessAddress || null;
    const occupation = Data.occupation || null;
    // const referenceNumber = Data.referenceNumber || null;
    const instituteId = Data.instituteId || null;
    const fpEnrollID = Data.fpEnrollID || null;

    // INSERT customer information
    db.query(
        `INSERT INTO customerinformation 
        (
          CustomerType, CustomerTitle, CustomerID, GroupCode, SubGroupCode, CustomerName, 
          CustomerFullName, HomeNo, HomeStreet, HomeTown, HomeCountry, BussinessLocationNo, 
          BusinessStreet, BussinessTown, BussinessName, ImportantNote, BirthDay, NIC, Sex, 
          PersonnalTelephoneNo, PersonnalMobileNo, PersonnalEMail, HomeTelephoneNo, 
          BusinessTelephoneNo, WebSite, District, AGDivision, GSDivisionName, GSDivisionNo, 
          Religion, JoinedDate, AccountTransfereeName, TransfereesRelationship, MemberStatus, 
          sCustomerTitle, sCustomerName, sCustomerFullName, sHomeNo, sHomeStreet, sHomeTown, 
          MaritalStatus, CustomerAddress, sCustomerAddress, BussinessAddress, BeneficiaryNIC, 
          Occupation, ReferenceNumber, InstituteId, FPEnrollID
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerType, customerTitle, customerID, groupCode, subGroupCode, customerName,
          customerFullName, homeNo, homeStreet, homeTown, homeCountry, businessLocationNo,
          businessStreet, businessTown, businessName, importantNote, birthDay, nic, sex,
          personnalTelephoneNo, personnalMobileNo, personnalEMail, homeTelephoneNo,
          businessTelephoneNo, webSite, district, agDivision, gsDivisionName, gsDivisionNo,
          religion, joinedDate, accountTransfereeName, transfereesRelationship, memberStatus,
          sCustomerTitle, sCustomerName, sCustomerFullName, sHomeNo, sHomeStreet, sHomeTown,
          maritalStatus, customerAddress, sCustomerAddress, businessAddress, beneficiaryNIC,
          occupation, referenceNumber, instituteId, fpEnrollID
        ],
        (error, result) => {
          if (error) {
            console.error('Error inserting customer information:', error);
            return res.status(500).json({ message: 'Server error, please try again later' });
          }
          console.log('Customer information inserted successfully:', result);
          res.status(200).json({ message: 'Customer information inserted successfully' });
        }
      );
      
};
