const express = require('express');
const User = require('../models/user.model');
const { isAdmin } = require('../utils/roleMiddleware');

const router = express.Router();
const roles = ['admin', 'stsManager', 'landfillManager'];

const demoUsers = [
    { _id: 'demo-admin', name: 'Amina Rahman', email: 'amina@ecosync.demo', username: 'amina.admin', gender: 'Female', role: 'admin' },
    { _id: 'demo-sts', name: 'Rafi Islam', email: 'rafi@ecosync.demo', username: 'rafi.sts', gender: 'Male', role: 'stsManager' },
    { _id: 'demo-landfill', name: 'Nadia Karim', email: 'nadia@ecosync.demo', username: 'nadia.landfill', gender: 'Female', role: 'landfillManager' }
];

function isDemoSession(req) {
    return Boolean(req.session && req.session.user && req.session.user.demo);
}

function demoActionComplete(res, message) {
    return res.status(200).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="2;url=/admin-panel"><title>Demo preview | EcoSync</title><link rel="stylesheet" href="/styles.css"></head><body><main class="status-page"><section class="status-card"><span class="badge">Demo preview</span><h1>Action previewed</h1><p>${message}</p><a class="btn btn--primary" href="/admin-panel">Return to workspace</a></section></main></body></html>`);
}


// List all users (Admin access)
router.get('/users', isAdmin, async (req, res) => {
    if (isDemoSession(req)) {
        return res.render('users-list', { users: demoUsers });
    }
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
    if (isDemoSession(req)) {
        const user = demoUsers.find((entry) => entry._id === req.params.userId) || demoUsers[0];
        return res.render('edit-user', { user, roles });
    }
    try {
        const user = await User.findById(req.params.userId);
        // Make sure to pass the roles array to the template
        res.render('edit-user', { user, roles });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Server error');
    }
});
// Update user details
// Update user details including password
router.post('/users/update/:userId', isAdmin, async (req, res) => {
    if (isDemoSession(req)) {
        return demoActionComplete(res, 'The account update flow works here without changing live data.');
    }
    try {
        const { name, email, username, gender, password, role } = req.body;

        // Constructing the update object
        let updateObject = {
            name,
            email,
            username,
            gender,
            role // Updating the role as received from the form
        };

        // Only add password to the update object if it's provided
        if (password && password.trim() !== '') {
            updateObject.password = password;
        }

        // Update the user with the constructed update object
        await User.findByIdAndUpdate(req.params.userId, updateObject);

        // Redirect back to the users list or to an appropriate page
        res.redirect('/users'); // Ensure this redirect matches where you'd like the user to go post-update


    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).send('Server error');
    }
});



// GET method for listing all available roles
router.get('/users/roles', isAdmin, (req, res) => {
    res.render('roles-list', { roles });
});

// Simulate DELETE operation for deleting a user
// Simulate DELETE operation for deleting a user
router.post('/users/delete/:userId', isAdmin, async (req, res) => {
    if (isDemoSession(req)) {
        return demoActionComplete(res, 'The account removal flow works here without changing live data.');
    }
    try {
        await User.findByIdAndDelete(req.params.userId); // Use findByIdAndDelete
        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// DELETE method for deleting a user (System Admin access)
router.delete('/users/:userId', isAdmin, async (req, res) => {
    if (isDemoSession(req)) {
        return res.status(200).send('Demo preview: no live user was deleted.');
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



router.post("/users", isAdmin, async (req, res) => {
    if (isDemoSession(req)) {
        return demoActionComplete(res, 'The user creation flow works here without adding an account to the live directory.');
    }
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
