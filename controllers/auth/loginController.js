const db = require("../../database");
const md5 = require('md5');

exports.login = (req, res) => {
    const Data = req.body; // get data from client

    const web_password = Data.web_password;
    const UserName = Data.UserName;

    // check if UserName is provided
    if(!UserName){
        return res.status(400).json({ message: 'Please provide the UserName'});
    }
    // check if web_password is provided
    if (!web_password) {
        return res.status(400).json({ message: 'Please provide the web_password' });
    }

    // convert user input web_password to MD5 hash
    const MD5_web_password = md5(web_password);

    db.query('SELECT UserID, UserName, UserFullName, web_password FROM systemusers WHERE web_password = ? AND UserName = ?', [MD5_web_password, UserName], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'No user found with the given password' });
        }

        // get DB web_password from database
        const DB_web_password = result[0].web_password;
        // console.log('MD5_web_password:', MD5_web_password);
        

        if (MD5_web_password !== DB_web_password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const userID = result[0].UserID;
        const UserFullName = result[0].UserFullName;

        return res.status(200).json({ message: 'Login successful', success: true, userID: userID, UserFullName: UserFullName });

    });
}