const aws = require('aws-sdk')

aws.config.update({
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "us-west-2",
    credentials: new aws.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:97665755-35ff-4f8b-bfa4-1cf13f99b2c8'
    })
})

const s3 = new aws.S3()

exports.getImages = (req, res, next) => {
    let imageDirectory = req.params.postId ? req.params.postId : ''
    let imageUrlPrefix = 'https://s3-us-west-2.amazonaws.com/tylorkolbeck.com/imageUploads/'

        const s3Params = {
            Bucket: 'tylorkolbeck.com',
            MaxKeys: 20,
            Delimiter: '',
            Prefix: `imageUploads/`,
        }

        s3.listObjectsV2(s3Params, (err, data) => {
            if (err) {
                res.json({
                    error: err
                })
            }

            let imageArray = []
            if (err) {
                console.log(err)
            } 

            data.Contents.forEach((img) => {
                let imageName = img.Key.split('/')
                imageArray.push(imageUrlPrefix + imageDirectory + imageName[imageName.length - 1])
            })
            // console.log(data)

            res.json({
                images: imageArray
            })
        })
}

exports.postImage = (req, res, next) => {
    
}
