// // backend/routes/officerRoutes.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const pool = require('../db'); // Database connection

// const router = express.Router();

// // Register Officer
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if the username already exists
//     const [existingUser] = await pool.query('SELECT * FROM login WHERE username = ?', [username]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new officer
//     await pool.query('INSERT INTO login (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
//     res.status(201).json({ message: 'Officer registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login Officer
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const [users] = await pool.query('SELECT * FROM login WHERE username = ?', [username]);
//     const user = users[0];

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid username or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.user_id }, process.env.ACCESS_TOKEN_, { expiresIn: '1h' });

//     res.json({ message: 'Login successful', token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // Export the router
// module.exports = router;


// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/authmiddleware'); // Check this import
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.ACCESS_SECRET_TOKEN || 'shreya123'; // Secure the key



// User Registration
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Check if the user already exists
        const [existingUser] = await pool.query('SELECT * FROM login WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await pool.query(
            'INSERT INTO login (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
});

//login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database by username
    const [users] = await pool.query('SELECT * FROM login WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = users[0]; // Get the first user from the query result
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token with user_id and role
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      secret,
      { expiresIn: '1h' }
    );

    console.log('Token generated:', token); // Debug log

    // Send back token and role
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Login error:', error); // Log server error
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
