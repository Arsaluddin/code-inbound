const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const { generateToken, hashPassword, comparePassword } = require('../services/authService');
const { getRepository } = require('typeorm');
const User = require('../entities/User');

// User registration
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userRepository = getRepository(User);
      const { name, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before saving it
      const hashedPassword = await hashPassword(password);

      // Create a new user
      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      // Generate a JWT token for the new user
      const token = generateToken(newUser);

      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// User login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userRepository = getRepository(User);
      const { email, password } = req.body;

      // Find the user by email
      const user = await userRepository.findOne({where : {email}});
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Compare the provided password with the hashed password
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed h' });
      }

      // Generate a JWT token for the authenticated user
      const token = generateToken(user);

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
