const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')


// ## THIS CONTROLS THE IMAGE UPLOAD ## //

// aws.config.update({np
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     region: "us-west-2"
// })

// aws.config.update({region: 'us-west-2'})
// let iam = new aws.IAM({apiVersion: '2010-05-08'})
aws.config.loadFromPath('../config.json')
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
            cb(null, Date.now().toString() + '.jpg')
        }
    })
})

module.exports = upload