const path = require('path')
const os = require('os')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

function handleUploadImage(busboy, bucket, update) {
    let imagePath
    let imageName
    let imageMimetype
    const generatedToken = uuidv4()

    busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {

        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).send("Image's file format is not accepted")
        }

        imageExtension = fileName.split('.')[fileName.split('.').length - 1]
        imageMimetype = mimetype
        imageName = `${uuidv4()}.${imageExtension}`        
        imagePath = path.join(os.tmpdir(), imageName)
        file.pipe(fs.createWriteStream(imagePath))
    })

    busboy.on('finish', () => {
        if(imagePath) {
            bucket.upload(
                imagePath,
                {
                    metadata: {
                        metadata: {
                            firebaseStorageDownloadTokens: generatedToken,
                        },
                        contentType: imageMimetype
                    }
                }
            ).then(() => {
                update(imageName, generatedToken)
            })
        }
        else {
            update(imageName, generatedToken)
        }
    })
}

module.exports = handleUploadImage