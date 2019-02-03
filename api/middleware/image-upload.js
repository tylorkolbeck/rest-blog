const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

// ## THIS CONTROLS THE IMAGE UPLOAD ## //

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "us-west-2"
})

const s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'tylorkolbeck.com',
        acl: 'public-read', 
        metadata: function(req, file, cb) {
            cb(null, {fieldName: 'file.fieldName'})
        },
        key: function(req, file, cb) {
            console.log('TEST' , req)
            // let newFileName = Date.now().toString() + "-" + file.originalname
            let fullPath = 'imageUploads/' + file.imageDirectory + file.originalname
            cb(null, fullPath)
        }
    })
})

module.exports = upload