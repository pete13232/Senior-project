const path = require('path')

// For Upload File
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Uploaded')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })

module.exports = { multer, storage, upload }