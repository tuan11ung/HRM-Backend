const axios = require('axios');
const FormData = require('form-data');
const cloudflareConfig = require('../config/cloudflare.config');

/**
 * Upload image to Cloudflare Images API
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The content type of the file
 * @param {Object} metadata - Optional metadata to attach to the image
 * @returns {Promise<Object>} - The response from Cloudflare Images API
 */
const uploadImageToCloudflare = async (fileBuffer, fileName, contentType, metadata = {}) => {
  try {
    const formData = new FormData();
    
    // Add the file to form data
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: contentType
    });
    
    // Add metadata as JSON string
    formData.append('metadata', JSON.stringify(metadata));
    
    // Set requireSignedURLs to false to make images publicly accessible
    formData.append('requireSignedURLs', 'false');
    
    // Make API request to Cloudflare Images
    const response = await axios.post(
      cloudflareConfig.imagesBaseUrl,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
          ...formData.getHeaders()
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image to Cloudflare:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Upload image to Cloudflare Images API via URL
 * @param {string} imageUrl - The URL of the image to upload
 * @param {Object} metadata - Optional metadata to attach to the image
 * @returns {Promise<Object>} - The response from Cloudflare Images API
 */
const uploadImageUrlToCloudflare = async (imageUrl, metadata = {}) => {
  try {
    const formData = new FormData();
    
    // Add the URL to form data
    formData.append('url', imageUrl);
    
    // Add metadata as JSON string
    formData.append('metadata', JSON.stringify(metadata));
    
    // Set requireSignedURLs to false to make images publicly accessible
    formData.append('requireSignedURLs', 'false');
    
    // Make API request to Cloudflare Images
    const response = await axios.post(
      cloudflareConfig.imagesBaseUrl,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
          ...formData.getHeaders()
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image URL to Cloudflare:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  uploadImageToCloudflare,
  uploadImageUrlToCloudflare
}; 