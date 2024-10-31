const db = require('../database');

exports.saveData = (req, res) => {
    const Data = req.body; // get data from client

    // Check if client data is provided
    if (!Data || Object.keys(Data).length === 0) {
        return res.status(400).json({ message: 'No data provided for insertion' });
    }

    // Prepare query for dynamic insertion
    const fields = Object.keys(Data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(Data);

    let query = `INSERT INTO ledgerdetails (${fields.join(', ')}) VALUES (${placeholders})`;

    // Execute the query
    db.query(query, values, (error, result) => {
        if (error) {
            console.log(error);
            
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        res.status(200).json({
            message: 'Client details inserted successfully'
        });
    });
};
