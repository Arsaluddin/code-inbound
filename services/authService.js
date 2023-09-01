const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds for bcrypt hashing
  return await bcrypt.hash(password, saltRounds);
}

// Function to compare a password with a hashed password
async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
};
