const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const cloudflareConfig = require('../config/cloudflare.config');

// Create S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: cloudflareConfig.region,
  endpoint: cloudflareConfig.endpoint,
  credentials: {
    accessKeyId: cloudflareConfig.accessKeyId,
    secretAccessKey: cloudflareConfig.secretAccessKey
  }
});

/**
 * Upload file to Cloudflare R2
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The content type of the file
 * @returns {Promise<string>} - The URL of the uploaded file
 */
const uploadFileToR2 = async (fileBuffer, fileName, contentType) => {
  try {
    // Create a unique key for the file (you can use uuid or any other method to generate unique names)
    const key = `${Date.now()}-${fileName}`;
    
    // Set the parameters for the upload
    const params = {
      Bucket: cloudflareConfig.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    };
    
    // Upload the file
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Return the public URL of the file
    return `${cloudflareConfig.publicUrl}/${key}`;
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw error;
  }
};

module.exports = {
  uploadFileToR2
}; 