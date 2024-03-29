require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes'); // Adjust the path based on your structure
const mongoose = require('mongoose');
const session = require('express-session');

// MongoDB connection string from your Atlas dashboard
const mongoDBUri = 'mongodb+srv://ehtesamul99:55555@cluster0.ogknxls.mongodb.net/xy?retryWrites=true&w=majority&appName=Cluster0'

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
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Example: Hardcoded admin login
    if (username === 'admin' && password === 'admin') {
        req.session.user = { username, role: 'admin' };
        res.redirect('/admin-panel'); // Redirect to an admin panel page
    } else {
        res.status(401).send('Login failed');
    }
});

app.get('/admin-panel', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('admin-panel');
    } else {
        res.status(403).send('Access Denied');
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
