const express = require('express');
const router = express.Router();
const providerProfileController = require('../controllers/providerProfileController');
const multer = require('multer');
const auth = require('../middleware/auth');

// Configure multer for file uploads
// In production, this would be configured to use S3 storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Provider profile routes
router.post('/basic-details', auth, providerProfileController.updateBasicDetails);
router.post('/work-details', auth, providerProfileController.updateWorkDetails);
router.post('/portfolio-pricing', auth, providerProfileController.updatePortfolioAndPricing);
router.post('/upload-portfolio', auth, upload.array('images', 5), providerProfileController.uploadPortfolioImages);
router.get('/:userId', auth, providerProfileController.getProviderProfile);

module.exports = router;