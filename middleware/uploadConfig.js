// middleware/uploadConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/vehicles')); // save to public/images
  },
  filename: function (req, file, cb) {
    // generate a unique name to avoid collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
