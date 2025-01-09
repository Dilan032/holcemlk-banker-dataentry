const db = require('../../database');

exports.cusRegister = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Validate required fields
    const requiredFields = ['customerType', 'customerTitle', 'referenceNumber', 'groupCode', 'customerName', 'customerFullName', 'homeNo', 'birthDay', 'nic', 'sex', 'joinedDate', 'sCustomerTitle', 'sCustomerName', 'sCustomerFullName', 'sHomeNo', 'beneficiaryNIC'];
    for (const field of requiredFields) {
        if (!Data[field]) {
            return res.status(400).json({ message: `Please provide the ${field}` });
        }
    }

    // initialize variables
    // customerID = Data.customerID; 
    const customerType = Data.customerType; 
    const customerTitle = Data.customerTitle;
    const referenceNumber = Data.referenceNumber;
    const groupCode = Data.groupCode;
    const customerName = Data.customerName;
    const customerFullName = Data.customerFullName; 
    const homeNo = Data.homeNo;
    const birthDay = Data.birthDay;
    const nic = Data.nic;
    const sex = Data.sex;
    const joinedDate = Data.joinedDate;
    const sCustomerTitle = Data.sCustomerTitle;
    const sCustomerName = Data.sCustomerName;
    const sCustomerFullName = Data.sCustomerFullName;
    const sHomeNo = Data.sHomeNo;
    const beneficiaryNIC = Data.beneficiaryNIC;

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
    const occupation = Data.occupation || null;
    // const referenceNumber = Data.referenceNumber || null;
    const instituteId = Data.instituteId || null;
    const fpEnrollID = Data.fpEnrollID || null;

    let customerAddress = " ";
    // Create customer address
    if (homeNo && homeStreet && homeTown) {
       customerAddress = homeNo + ',' + homeStreet + ',' + homeTown + '. ';
    } else if (homeNo && homeStreet) {
       customerAddress = homeNo + ',' + homeStreet + '. ';
    } else if (homeNo && homeTown) {
       customerAddress = homeNo + ',' + homeTown + '. ';
    } else if (homeNo) {
       customerAddress = homeNo + '. ';
    }

    let sCustomerAddress = " ";
    // Create sCustomer address
    if (sHomeNo && sHomeStreet && sHomeTown) {
       sCustomerAddress = sHomeNo + ',' + sHomeStreet + ',' + sHomeTown + '. ';
    } else if (sHomeNo && sHomeStreet) { 
       sCustomerAddress = sHomeNo + ',' + sHomeStreet + '. ';
    } else if (sHomeNo && sHomeTown) {
       sCustomerAddress = sHomeNo + ',' + sHomeTown + '. ';
    } else if (sHomeNo) {
       sCustomerAddress = sHomeNo + '. ';
    }

    let businessAddress = " ";
    // Create business address
    if (businessLocationNo && businessStreet && businessTown) {
       businessAddress = businessLocationNo + ',' + businessStreet + ',' + businessTown + '. ';
    } else if (businessLocationNo && businessStreet) {
       businessAddress = businessLocationNo + ',' + businessStreet + '. ';
    } else if (businessLocationNo && businessTown) {
       businessAddress = businessLocationNo + ',' + businessTown + '. ';
    } else if (businessLocationNo) {
       businessAddress = businessLocationNo + '. ';
    }

    // Generate customerID (xx-xx-xxxxx) 
    db.query('SELECT (MAX(RIGHT(CustomerID,5)) + 1) AS NextNo FROM customerinformation WHERE CustomerType = ?', [customerType], (error, result) => {
      if (error){
        console.error('Error generating customer ID:', error);
        return res.status(500).json({ message: 'Server error, please try again later' });
      }
      
      // Check if result is empty
      let newIDNo = result[0].NextNo || 1; // Use 1 if no existing records are found
      // console.log('newIDNo:', newIDNo);
      

      // Check if NextNo is greater than 99999
      if (newIDNo >= 99999) {
        return res.status(400).json({ message: 'Customer ID limit exceeded (xx-xx-99999)' });
      }

      db.query('SELECT MemberTypeId FROM customerinformationprerequisite WHERE MemberType = ?', [customerType], (error, result) => {
        if (error){
          console.error('Error fetching institute ID:', error);
          return res.status(500).json({ message: 'Server error, please try again later' });
        }
        
        // Check if result is empty
        if (result.length === 0) {
          return res.status(400).json({ message: 'MemberType Id not found' });
        }
        
      const MemberTypeId = result[0].MemberTypeId;
      // console.log('MemberTypeId:', MemberTypeId);
      

      // Generate customer ID
      const customerID = instituteId + MemberTypeId + newIDNo.toString().padStart(5, '0');
      console.log('Generated customer ID:', customerID);

      // Check if customerID already exists
      db.query('SELECT CustomerID FROM customerinformation WHERE CustomerID = ?', [customerID], (error, result) => {
        if (error){
          console.error('Error checking customer ID:', error);
          return res.status(500).json({ message: 'Server error, please try again later' });
        }
        
        // Check if result is empty
        if (result.length > 0) {
          return res.status(400).json({ message: 'Customer ID already exists' });
        }

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
      
    }) // end of db.query for checking customerID

    }); // end of db.query for checking MemberTypeId

    }); // end of db.query for generating customerID
      
};
