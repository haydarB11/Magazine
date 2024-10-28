const multer = require('multer');

function upload(destination) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    });

    return multer({ storage });
}

module.exports = {
    upload
};