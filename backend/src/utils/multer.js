const multer = require('multer');

// Initialize Multer with the storage engine
const upload = multer({
  storage: multer.memoryStorage()
});

module.exports = upload;
