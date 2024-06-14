require('dotenv').config();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, full_name: user.full_name, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, company, full_name, password } = req.body;

  try {
    const user = await User.signup(email, company, full_name, password);

    user.role = 'user';
    await user.save();

    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token, full_name, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };