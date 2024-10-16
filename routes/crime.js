// backend/routes/crimeRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/authmiddleware');

// Admin gets all crimes
router.get('/all-crimes', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const [crimes] = await pool.query('SELECT * FROM crimes');
        res.json(crimes);
    } catch (error) {
        console.error('Error fetching crimes:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin deletes a crime
router.delete('/delete-crime/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const crimeId = req.params.id;
    try {
        await pool.query('DELETE FROM crimes WHERE crime_id = ?', [crimeId]);
        res.status(200).json({ message: 'Crime deleted successfully' });
    } catch (error) {
        console.error('Error deleting crime:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Officer adds a new crime report
router.post('/add-crime', authenticateToken, authorizeRole('officer'), async (req, res) => {
    const { title, description, location } = req.body;
    try {
        await pool.query(
            'INSERT INTO crimes (title, description, location) VALUES (?, ?, ?)',
            [title, description, location]
        );
        res.status(201).json({ message: 'Crime added successfully' });
    } catch (error) {
        console.error('Error adding crime:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin assigns an officer to a crime
router.post('/assign-crime', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { crime_id, user_id } = req.body;
    try {
        await pool.query(
            'INSERT INTO crime_assignments (crime_id, user_id) VALUES (?, ?)',
            [crime_id, user_id]
        );
        res.status(201).json({ message: 'Crime assigned successfully' });
    } catch (error) {
        console.error('Error assigning crime:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Officer retrieves assigned cases
router.get('/assigned-cases', authenticateToken, authorizeRole('officer'), async (req, res) => {
    const userId = req.user.user_id; // Get user_id from token payload
    try {
        const [assignedCases] = await pool.query(
            `SELECT c.*
            FROM crimes c
            JOIN crime_assignments ca ON c.crime_id = ca.crime_id
            WHERE ca.user_id = ?`, 
            [userId]
        );
        res.json(assignedCases);
    } catch (error) {
        console.error('Error fetching assigned cases:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Officer updates a crime based on crime_id
router.put('/update-crime/:crime_id', authenticateToken, authorizeRole('officer'), async (req, res) => {
    const { crime_id } = req.params;
    const { title, description, location } = req.body;

    try {
        // Check if the crime exists
        const [crime] = await pool.query('SELECT * FROM crimes WHERE crime_id = ?', [crime_id]);
        if (crime.length === 0) {
            return res.status(404).json({ error: 'No crime found with the given ID' });
        }

        // Prepare the update query dynamically based on provided fields
        const updates = [];
        const values = [];

        if (title) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description) {
            updates.push('description = ?');
            values.push(description);
        }
        if (location) {
            updates.push('location = ?');
            values.push(location);
        }

        if (updates.length > 0) {
            // Join the updates for the SQL query
            const sql = `UPDATE crimes SET ${updates.join(', ')} WHERE crime_id = ?`;
            values.push(crime_id); // Add the crime_id to the end of the values array

            await pool.query(sql, values);
            return res.status(200).json({ message: 'Crime updated successfully' });
        } else {
            return res.status(400).json({ error: 'No fields to update' });
        }
    } catch (error) {
        console.error('Error updating crime:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
