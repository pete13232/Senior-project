const util = require('util')
const multer = require("multer");

const storage_cloud = multer.memoryStorage()
const storage_local = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Uploaded')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
  }
})

let upload_cloud = multer({
  storage: storage_cloud,
}).single("file");

let upload_local = multer({
  storage: storage_local,
}).single("file");

let uploadCloudMiddleware = util.promisify(upload_cloud)
let uploadLocalMiddleware = util.promisify(upload_local)

module.exports = {uploadCloudMiddleware, uploadLocalMiddleware}
