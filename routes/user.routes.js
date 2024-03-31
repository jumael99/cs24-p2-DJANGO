const express = require('express');
const User = require('../models/user.model');
const { isAdmin } = require('../utils/roleMiddleware');

const router = express.Router();

const roles = ['admin', 'stsManager', 'landfillManager', 'unassigned'];


// List all users (Admin access)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render('users-list', { users }); // Render the view with the users data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get specific user details
router.get('/users/edit/:userId', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('edit-user', { user }); // Assuming 'edit-user.ejs' is your new EJS file for editing users
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// Update user details
// Update user details including password
router.post('/users/update/:userId', isAdmin, async (req, res) => {
    try {
        const { name, email, username, gender, password } = req.body;
        await User.findByIdAndUpdate(req.params.userId, { name, email, username, gender, password });
        res.redirect('/api/users'); // Redirect back to the users list
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// GET method for listing all available roles
router.get('/users/roles', (req, res) => {
    res.render('roles-list', { roles });
});

// Simulate DELETE operation for deleting a user
// Simulate DELETE operation for deleting a user
router.post('/users/delete/:userId', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId); // Use findByIdAndDelete
        res.redirect('/api/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// DELETE method for deleting a user (System Admin access)
router.delete('/users/:userId', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



router.post("/users", async (req, res) => {
    try {
        const { name, email, username, password, gender, role } = req.body;
        // Use your User model to create a new user document
        const newUser = await User.create({
            name,
            email,
            username,
            password, // Make sure to hash passwords in production
            gender,
            role
        });
        res.status(201).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>User has been created</title>
                <meta http-equiv="refresh" content="2;url=/admin-panel" />
            </head>
            <body>
                <h1>Success!</h1>
                <p>Your data has been successfully submitted. You will be redirected shortly.</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});





module.exports = router;
