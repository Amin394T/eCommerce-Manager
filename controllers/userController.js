import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/userModel.js";
import { createError } from "../utils/AppError.js";

const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const loginAttempts = new Map();

const checkLoginAttempts = (username) => {
  const userAttempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  
  if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeElapsed = Date.now() - userAttempts.lastAttempt;
    if (timeElapsed < LOGIN_TIMEOUT) {
      throw createError(`Too many login attempts. Please try again in ${Math.ceil((LOGIN_TIMEOUT - timeElapsed) / 60000)} minutes.`, 429);
    }
    userAttempts.count = 0;
  }
  
  return userAttempts;
};

const incrementLoginAttempts = (username) => {
  const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(username, attempts);
};

export async function register(req, res, next) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    });

    if (existingUser) {
      throw createError('Username or email already exists', 400);
    }

    const hashedPassword = await hash(req.body.password, SALT_ROUNDS);
    
    const user = new User({
      username: req.body.username.trim(),
      email: req.body.email.trim(),
      password: hashedPassword,
      status: 'active'
    });

    await user.save();

    // Create token but don't send password
    const token = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // Check login attempts
    const attempts = checkLoginAttempts(username);

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      incrementLoginAttempts(username);
      throw createError('Invalid credentials', 401);
    }

    if (user.status === "blocked") {
      throw createError('Account is blocked. Please contact support.', 403);
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      incrementLoginAttempts(username);
      throw createError('Invalid credentials', 401);
    }

    // Reset login attempts on successful login
    loginAttempts.delete(username);

    const token = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      status: user.status
    };

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    next(error);
  }
}
