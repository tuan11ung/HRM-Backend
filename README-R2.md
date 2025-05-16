# Cloudflare R2 Image Upload Integration

This integration allows users to upload images to Cloudflare R2 storage and receive back the public URL of the uploaded image.

## Setup

1. Create a Cloudflare R2 account if you don't have one
2. Create a bucket in your Cloudflare R2 dashboard
3. Set up public access for your bucket (Create a Public R2 Bucket or configure CORS)
4. Create API tokens with appropriate permissions
5. Add the following environment variables to your `.env` file:

```
# Cloudflare R2 settings
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-bucket-url.r2.dev
```

## API Usage

### Upload an image

**Endpoint:** `POST /api/upload/image`

**Authentication:** Required (JWT Token)

**Request:**
- Method: `POST`
- Headers:
  - `x-access-token`: Your JWT token
  - `Content-Type`: `multipart/form-data`
- Body:
  - `image`: The image file to upload (form-data)

**Response:**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://pub-your-bucket-url.r2.dev/1721234567890-image.jpg"
  }
}
```

## Error Handling

The API returns appropriate error messages for:
- Missing image
- Non-image files
- Files exceeding the size limit (5MB)
- Authentication failures
- Server errors 