const express = require('express');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Define your routes and endpoints here

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
