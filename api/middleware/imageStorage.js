// This script handles image uploads.
// specifically only used for posts uploads right now. 

const multer = require('multer')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/postImages')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('File type not accepted.'), false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        filesize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})

module.exports.upload
