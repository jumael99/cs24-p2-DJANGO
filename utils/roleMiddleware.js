const isAdmin = (req, res, next) => {
    // Assuming `req.session.user.role` contains the user's role
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Only admins can perform this action.');
    }
};

module.exports = { isAdmin };
