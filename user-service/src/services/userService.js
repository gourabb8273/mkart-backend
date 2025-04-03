import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';

// Save (create or update) user service used on initial save
export const saveUserService = async (userDetails) => {
  try {
    const { profile, auth0Id, isLoggedIn } = userDetails;
    if (!profile || !profile.email) {
      throw new Error('Profile and email are required');
    }
    const dataToSave = {
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      gender: profile.gender,
      role: profile.role,
      picture: profile.picture,
      auth0Id,
      lastLogginAt: new Date()
    };
    let user = await User.findOne({ email: profile.email });
    if (user) {
      user = await User.findOneAndUpdate({ email: profile.email }, dataToSave, { new: true });
    } else {
      user = await User.create(dataToSave);
    }
    return user;
  } catch (error) {
    console.log("failed", error);
    throw new Error('Failed to save user: ' + error.message);
  }
};

// Update service for partial updates (PATCH)
export const updateUserService = async (email, updates) => {
  try {
    if (!email) {
      throw new Error('Email is required for update');
    }
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { ...updates, lastLogginAt: new Date() },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update user: ' + error.message);
  }
};

// New service function to get all users
export const getAllUsersService = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw new Error('Failed to retrieve users: ' + error.message);
  }
};


