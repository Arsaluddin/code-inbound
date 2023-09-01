const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const { Client } = require('pg')
const typeorm = require('typeorm');
const userRoutes = require('./routes/userRouter');
const authRoutes = require('./routes/authRouter');
const errorHandler = require('./middleware/errorHandling');
const Users = require('./entities/User');

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

 // Create a database connection
typeorm.createConnection({
    type: 'postgres', // The type of the database
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    username: 'postgres',
    password: process.env.PASSWORD,
    database: 'code-inbound',
    entities: [Users], // List of your entities
    synchronize: true, // Automatically create tables based on entities (for development only)
  })
    .then(() => {
      console.log('Connected to the database');
  
      // Set up routes
      app.use('/users', userRoutes);
      app.use('/auth',authRoutes);
      app.use(errorHandler);
  
      // Start the Express server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(error => {
      console.error('Database connection error:', error);
    });
  

