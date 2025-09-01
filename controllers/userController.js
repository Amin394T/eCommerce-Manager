import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import User from "../models/userModel.js";
import { createError } from "../utilities/ErrorMsg.js";


// Authentication parameters
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60 * 1000;

let loginAttempts = new Map();


// Login attempts tracking
const checkLoginAttempts = (username) => {
  const userAttempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  
  if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
    let timeElapsed = Date.now() - userAttempts.lastAttempt;
    
    if (timeElapsed < LOGIN_TIMEOUT) {
      let timeLeft = Math.ceil((LOGIN_TIMEOUT - timeElapsed) / 60000);
      throw createError(`Too many login attempts. Try again in ${timeLeft} minutes.`, 429);
    }
    else {
      userAttempts.count = 0;
    }
  }
  
  return userAttempts;
};

const updateLoginAttempts = (username) => {
  let attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(username, attempts);
};


// User registration
export async function register(req, res, next) {
  try {

    // Prepare request data
    let existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      throw createError('Username already exists', 400);
    }
    let hashedPassword = await hash(req.body.password, SALT_ROUNDS);

    // Persist user data
    let user = new User({
      username: req.body.username.trim(),
      password: hashedPassword,
      phone: req.body.phone.trim(),
      status: 'active'
    });
    await user.save();

    // Handle response data
    let token = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, phone: user.phone },
      token
    });
  }
  catch (error) {
    next(error);
  }
}


// User authentication
export async function login(req, res, next) {
  try {
    let { username, password } = req.body;

    // Check username validity
    checkLoginAttempts(username);
    
    let user = await User.findOne({ username }).select('+password');
    if (!user) {
      updateLoginAttempts(username);
      throw createError('Invalid credentials', 401);
    }

    if (user.status === "blocked") {
      throw createError('Account is blocked. Please contact support.', 403);
    }

    // Check password validity
    let isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      updateLoginAttempts(username);
      throw createError('Invalid credentials', 401);
    }

    // Handle successful login
    loginAttempts.delete(username);

    let token = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, username: user.username, phone: user.phone },
      token
    });
  }
  catch (error) {
    next(error);
  }
}
