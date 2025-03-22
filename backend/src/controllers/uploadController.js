// backend/src/controllers/uploadController.js
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS S3 credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const fileName = Date.now().toString() + '-' + file.originalname;
      cb(null, fileName);
    },
  }),
});

exports.uploadFiles = upload.array('portfolioImages', 5); // limit to 5 files

exports.uploadPortfolio = (req, res) => {
  // The files are automatically uploaded to S3 by multerS3
  // Return the file URLs to the frontend
  const fileUrls = req.files.map(file => file.location);
  res.json({ fileUrls });
};
