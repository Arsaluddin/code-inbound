const express = require('express');
const router = express.Router();
const { getRepository } = require('typeorm');
const User = require('../entities/User');
const { validationResult, body } = require('express-validator');

// Retrieve a list of users
router.get('/', async (req, res, next) => {
    try {
      const userRepository = getRepository(User);
      const users = await userRepository.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  

// Create a new user
router.post(
    '/',
    [
      body('name').notEmpty().withMessage('username is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('id').isInt().withMessage('should be integer'),
      body('password').notEmpty().withMessage('password is requires')
      // Add more validation rules as needed
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const userRepository = getRepository(User);
        const newUser = userRepository.create(req.body);
        await userRepository.save(newUser);
        res.status(201).json(newUser);
      } catch (error) {
        next(error);
      }
    }
  );

// Delete a user
router.delete('/:id', async (req, res, next) => {
    try {
      const userRepository = getRepository(User);
      const userId = parseInt(req.params.id); // Parse the ID as an integer
  
      // Check if the user with the specified ID exists
      const userToRemove = await userRepository.findOneBy(userId);
      
    //   if (!userToRemove) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }

    if (!userToRemove) {
        const error = new Error('User not found');
        error.status = 404;
        return next(error); // Throw an error with a specific status code
      }
      
      await userRepository.remove(userToRemove);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
  
  

// Update a user
router.put('/:id',
  [
      body('name').notEmpty().withMessage('username is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('id').isInt().withMessage('should be integer'),
      body('password').notEmpty().withMessage('password is requires')
    // Add more validation rules as needed
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userRepository = getRepository(User);
    
    const userId = parseInt(req.params.id); 

    const userToUpdate = await userRepository.findOneBy(userId);

      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      userRepository.merge(userToUpdate, req.body);
      const updatedUser = await userRepository.save(userToUpdate);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

  

module.exports = router;
