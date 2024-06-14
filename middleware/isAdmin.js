const User = require('../models/userModel')

const isAdmin = async (req, res, next) => {

  console.log("isAdmin has been called")
  
  try {
    const user = await User.findOne({ _id: req.user._id }).select('role');
    
    console.log('User Role:', user.role);

    if (user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. You are not authorized.' });
    }
  } catch (error) {

    console.log('isAdmin Error:', error);

    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = isAdmin;