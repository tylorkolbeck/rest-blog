const multer = require('multer')
const multers3 = require('multer-s3')
const aws = require('aws-sdk')


// ## THIS CONTROLS THE IMAGE UPLOAD ## //

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: "us-west-2"
})

const s3 = new aws.S3()


const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: 'tylorkolbeck.com',
        // acl: 'public-read', 
        metadata: function(req, file, cb) {
            cb(null, {fieldName: 'TEST_FILE_NAME'})
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload