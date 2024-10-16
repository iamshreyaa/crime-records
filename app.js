const express = require('express');
const mysql = require("mysql");
const pool = require('./db');
const loginRoutes = require('./routes/loginRoutes');
const crimeRoutes = require('./routes/crime');
const dotenv = require("dotenv").config();
const app = express();
const cors = require('cors');
const {authenticateToken} = require('./middleware/authmiddleware');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Check the database connection
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return;
    }
    console.log('Connected to the database');
    connection.release(); // Release the connection back to the pool
  });
  

//use login route
app.use('/api', loginRoutes);
app.use('/api/crimes',authenticateToken, crimeRoutes);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});


