const express = require('express');
const User = require('../models/user.model');
const { isAdmin } = require('../utils/roleMiddleware');

const router = express.Router();

// List all users (Admin access)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get specific user details
router.get('/users/:userId', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/users', isAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Create a new user instance with the provided details
        let user = new User({ username, password, role });

        // Save the user to the database
        user = await user.save();

        // Redirect to the admin panel page after successful user creation
        res.redirect('/admin-panel');
    } catch (err) {
        console.error(err); // Logging the error to the console for debugging
        res.status(500).send('Server error'); // Sending a generic server error message
    }
});

module.exports = router;
