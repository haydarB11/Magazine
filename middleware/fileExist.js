const fs = require('fs');
const path = require('path');
const logsDirectory = path.join(__dirname, '../', 'logs');

const checkFileExists = (req, res, next) => {
    const filePath = path.join(logsDirectory, req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    req.filePath = filePath;
    next();
};

module.exports = checkFileExists;