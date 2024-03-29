require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes'); // Adjust the path based on your structure
const mongoose = require('mongoose');
const session = require('express-session');
const { isAdmin } = require('./utils/roleMiddleware');
const User = require('./models/user.model')
// MongoDB connection string from your Atlas dashboard
const mongoDBUri = 'mongodb+srv://ehtesamul99:55555@cluster0.ogknxls.mongodb.net/xy?retryWrites=true&w=majority&appName=Cluster0'
const STSData = require('./models/stsData.model'); // Adjust the path as necessary based on your project structure


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key', // Use a long, random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', maxAge: 3600000 } // secure: 'auto' will use secure cookies if the site uses HTTPS
}));

app.set('view engine', 'ejs');


// Hardcoded admin credentials
const adminCredentials = {
    username: 'admin', password: 'admin'
};


// Use routes
app.use('/api', userRoutes);


app.get('/login', (req, res) => {
    res.render('login');
});



// Auth routes
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // First, check if the username exists in the database
    const user = await User.findOne({ username });

    if (!user) {
        // If the username isn't found, send a specific error message
        return res.status(401).send('Username does not exist');
    }

    // If the username exists but the password doesn't match, send a different error
    if (user.password !== password) {
        return res.status(401).send('Incorrect password');
    }

    // If both username and password match, proceed with setting the session and redirecting
    req.session.user = { id: user._id, username: user.username, role: user.role };

    // Redirect based on role
    switch(user.role) {
        case 'admin':
            return res.redirect('/admin-panel');
        case 'stsManager':
            return res.redirect('/sts-manager-panel');
        case 'unassigned':
            return res.status(401).send("User role Unassigned!! Can't login");
        case 'landfillManager':
            return res.redirect('/landfill-manager-panel');
        default:
            return res.status(403).send('Access Denied');
    }
});

//admin-route
app.get('/admin-panel', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('admin-panel');
    } else {
        res.status(403).send('Access Denied');
    }
});

//sts-manager route
app.get('/sts-manager-panel', (req, res) => {
    if (req.session.user && req.session.user.role === 'stsManager') {
        res.render('sts-manager-panel');
    } else {
        res.status(403).send('Access Denied');
    }
});

// Landfill Manager Panel Route
app.get('/landfill-manager-panel', (req, res) => {
    if (req.session.user && req.session.user.role === 'landfillManager') {
        res.render('landfill-manager-panel');
    } else {
        res.status(403).send('Access Denied');
    }
});

// Logout route
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err); // Log any error if session destruction fails
            res.send('Error logging out'); // Send or handle the error in a way that makes sense for your application
        } else {
            res.redirect('/login'); // Redirect to login page after successful logout
        }
    });
});

//sts-manager info edit
app.get('/sts-manager/edit', (req, res) => {
    // Ensure the user is authenticated and has the stsManager role
    if (req.session.user && req.session.user.role === 'stsManager') {
        res.render('edit-sts-manager');
    } else {
        res.status(403).send('Access Denied');
    }
});

//sts manager data entry
app.get('/sts-manager/data-entry', (req, res) => {
    // Ensure the user is authenticated and has the stsManager role
    if (req.session.user && req.session.user.role === 'stsManager') {
        res.render('data-entries');
    } else {
        res.status(403).send('Access Denied');
    }
});

//sts-data post from ejs form
app.post('/sts-data/create', async (req, res) => {
    // Extract form data from req.body
    const { stsNumber, vehicleNumber, arrivalTime, departureTime, wasteWeight } = req.body;

    // Assume managerId is obtained from the session
    const managerId = req.session.user.id;

    try {
        // Use the STSData model to save the new entry
        await STSData.create({
            stsNumber,
            vehicleNumber,
            arrivalTime,
            departureTime,
            wasteWeight,
            managerId
        });

        res.redirect('/sts-manager-panel'); // Redirect back to the STS manager panel or a success page
    } catch (error) {
        console.error('Error saving STS data:', error);
        res.status(500).send('Error saving data');
    }
});

//This endpoint will serve the profile view with the user's current information.
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile-view', {
            user: req.session.user,
            role: req.session.user.role // Assuming the role is stored in the session
        });
    } else {
        // Redirect to login page or display an error message
        res.redirect('/login');
    }
});

//PUT /profile for Updating the Logged-in User's Profile
app.post('/profile', async (req, res) => {
    const { username, password } = req.body; // You can include other fields that are allowed to be updated.

    if (!req.session.user) {
        return res.status(403).send('Not logged in');
    }

    try {
        const updateData = { username };
        if (password) updateData.password = password; // Update password if provided
        // Update the user profile
        await User.findByIdAndUpdate(req.session.user.id, updateData);

        // Optionally, update session information
        req.session.user.username = username;

        res.redirect('/profile'); // Redirect to the profile page after update
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Error updating profile');
    }
});





// Starting the server


mongoose.connect(mongoDBUri,)
    .then(() => {
        console.log('MongoDB connection successful');

        // Start the server after a successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
