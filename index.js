const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const { Client } = require('pg')


// const userRoutes = require('./routes/userRoutes');
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'code-inbound',
    password: process.env.PASSWORD,
    port: 5432,
  })
  client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
