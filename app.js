const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Sample route
app.get('/', (req, res) => {
  res.send('Node.js backend for Flutter app is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use('/save', require('./routes'));
