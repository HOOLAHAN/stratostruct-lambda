const express = require('express');
const { signupUser, loginUser, deleteUser } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// delete user route
router.delete('/delete', requireAuth, deleteUser);

// admin-only route
router.get('/admin', requireAuth, isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin page!' });
});

module.exports = router;
