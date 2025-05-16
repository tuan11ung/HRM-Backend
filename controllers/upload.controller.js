const { uploadImageToCloudflare, uploadImageUrlToCloudflare } = require('../utils/cloudflare-images.util');
const multer = require('multer');

// Configure multer for memory storage (we need the buffer for uploading to Cloudflare Images)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files - check Cloudflare Images supported formats
    // https://developers.cloudflare.com/images/upload-images/formats-limitations/
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image'); // 'image' is the field name in the form

// Upload image to Cloudflare Images
exports.uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image.'
      });
    }

    try {
      // Add optional metadata if provided in the request
      const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
      
      // Upload file to Cloudflare Images
      const result = await uploadImageToCloudflare(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        metadata
      );

      return res.status(200).json({
        status: 'success',
        message: 'Image uploaded successfully',
        data: result.result
      });
    } catch (error) {
      console.error('Error in upload controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload image',
        error: error.response?.data || error.message
      });
    }
  });
};

// Upload image from URL to Cloudflare Images
exports.uploadImageUrl = async (req, res) => {
  try {
    const { url, metadata } = req.body;
    
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an image URL.'
      });
    }
    
    // Upload image URL to Cloudflare Images
    const result = await uploadImageUrlToCloudflare(
      url,
      metadata || {}
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: result.result
    });
  } catch (error) {
    console.error('Error in upload URL controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to upload image from URL',
      error: error.response?.data || error.message
    });
  }
}; 