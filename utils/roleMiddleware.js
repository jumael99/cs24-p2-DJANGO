const isAdmin = (req, res, next) => {
    const role = req.query.role || req.headers['role'];

    if (role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Only admins can perform this action.');
    }
};

module.exports = { isAdmin };
