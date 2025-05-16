const { uploadFileToR2 } = require('../utils/cloudflare.util');
const multer = require('multer');

// Configure multer for memory storage (we need the buffer for uploading to R2)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image'); // 'image' is the field name in the form

// Upload image to Cloudflare R2
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
      // Upload file to Cloudflare R2
      const fileUrl = await uploadFileToR2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      return res.status(200).json({
        status: 'success',
        message: 'Image uploaded successfully',
        data: {
          url: fileUrl
        }
      });
    } catch (error) {
      console.error('Error in upload controller:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload image'
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