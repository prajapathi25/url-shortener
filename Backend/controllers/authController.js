// controllers/authController.js

// Import User model
import User from '../models/User.js';

// Import bcryptjs
import bcrypt from 'bcryptjs';

// Import jsonwebtoken
import jwt from 'jsonwebtoken';


/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Basic validation
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    // 2. Find user by email
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    // 6. Send response
    return res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    // 1. Get user data
    const { name, email, password } = req.body;

    // 2. Basic validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error(
        'Please provide name, email, and password'
      );
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error(
        'A user with this email already exists'
      );
    }

    // 4. Generate salt
    const salt = await bcrypt.genSalt(10);

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 7. Send response
    return res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    next(error);
  }
};