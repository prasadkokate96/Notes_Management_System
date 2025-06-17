const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/token.util');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Create new user
    const user = await User.create({ username, email, password });
    
    // Generate JWT token using the utility
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('==== LOGIN REQUEST ====');
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Body Type:', typeof req.body);
    
    //  we are Checking that  if body is empty object
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('WARNING: Empty request body received');
      return res.status(400).json({ message: 'Request body is empty' });
    }
    
    // we Make sure email and password are extracted as strings
    const email = String(req.body.email || '');
    const password = String(req.body.password || '');
    
    console.log('Email received:', email);
    console.log('Password received length:', password.length);
    
    // Input validation with better logging
    if (!email || !password) {
      console.log('Missing credentials - Email exists:', !!email, 'Password exists:', !!password);
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email with explicit logging
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log(`User found with email: ${email}, id: ${user.id}`);
    
    // Validate password with explicit logging
    const isPasswordValid = await user.validatePassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password validation failed');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token using the utility
    const token = generateToken(user.id);
    console.log('Generated token for user:', user.id);
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

// Get current user profile  , this also the part of the view 
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ 
        association: 'notes',
        attributes: ['id', 'title', 'category', 'createdAt']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error getting profile', 
      error: error.message 
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    // User is already authenticated by middleware
    const token = generateToken(req.user.id);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      message: 'Server error refreshing token', 
      error: error.message 
    });
  }
};