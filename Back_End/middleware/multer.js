const util = require('util')
const multer = require("multer");

const storage = multer.memoryStorage()

let upload = multer({
  storage: storage,
}).single("file");

let uploadMiddleware = util.promisify(upload)
module.exports = uploadMiddleware;
