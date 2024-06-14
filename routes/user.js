const express = require('express');

// controller functions
const { signupUser, loginUser } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// admin-only route
router.get('/admin', requireAuth, isAdmin, (req, res) => {
  // This route is only accessible to administrators
  res.json({ message: 'Welcome to the admin page!' });
});

module.exports = router;
