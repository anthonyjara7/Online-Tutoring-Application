const { 
  S3Client,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { v4: uuid } = require('uuid');

const uploadController = {

  uploadProfilePicture: async (req, res) => {
    console.log(req.file);
    const s3Client = new S3Client({
      region: process.env.S3_BUCKET_REGION,
    });
    try {
      const key = uuid() + ".jpeg";
      await s3Client.send(
        new PutObjectCommand({
          ACL: "public-read",
          Bucket: process.env.S3_BUCKET,
          ContentType: "image/jpeg",
          Key: key,
          Body: req.file.buffer,
        })
      );
      return res.status(200).json({
        message: "File uploaded successfully",
        filename: key,
      });
    } catch (e) {
      console.log(e)
      return res.status(500).send("Upload error occured");
    }
  }
}

module.exports = uploadController;
