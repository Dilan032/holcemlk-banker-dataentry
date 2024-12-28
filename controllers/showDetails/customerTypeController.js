const db = require('../../database');

exports.CustomerType = (req, res) => {
    db.query('SELECT MemberTypeId, MemberType FROM customerinformationprerequisite WHERE MemberTypeId IS NOT NULL', (error, result) => {
        console.log(error);
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }
        

        if (result.length === 0) {
            return res.status(404).json({ message: 'Customer Type not found' });
        }


         // Map result to include both MemberTypeId and MemberType
         const MemberType = result.map(row => ({
            MemberTypeId: row.MemberTypeId,
            MemberType: row.MemberType
        }));
        
        res.status(200).json({ MemberType });
    });
};
