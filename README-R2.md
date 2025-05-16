# Cloudflare Images API Integration

This integration allows users to upload images to Cloudflare Images and receive back the public URL of the uploaded image along with variants.

## Setup

1. Create a Cloudflare account if you don't have one
2. Set up Cloudflare Images in your account
3. Create an API token with the necessary permissions to access Cloudflare Images
4. Add the following environment variables to your `.env` file:

```
# Cloudflare Images API Configuration
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

## API Usage

### Upload an image file

**Endpoint:** `POST /api/upload/image`

**Authentication:** Required (JWT Token)

**Request:**
- Method: `POST`
- Headers:
  - `x-access-token`: Your JWT token
  - `Content-Type`: `multipart/form-data`
- Body:
  - `image`: The image file to upload (form-data)
  - `metadata`: Optional JSON string with metadata (form-data)

**Response:**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "id": "2cdc28f0-017a-49c4-9ed7-87056c83901",
    "filename": "image.jpeg",
    "metadata": {
      "key": "value"
    },
    "uploaded": "2022-01-31T16:39:28.458Z",
    "requireSignedURLs": false,
    "variants": [
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/public",
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/thumbnail"
    ]
  }
}
```

### Upload an image via URL

**Endpoint:** `POST /api/upload/image-url`

**Authentication:** Required (JWT Token)

**Request:**
- Method: `POST`
- Headers:
  - `x-access-token`: Your JWT token
  - `Content-Type`: `application/json`
- Body:
```json
{
  "url": "https://example.com/path/to/image.jpg",
  "metadata": {
    "key": "value"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "id": "2cdc28f0-017a-49c4-9ed7-87056c83901",
    "filename": "image.jpeg",
    "metadata": {
      "key": "value"
    },
    "uploaded": "2022-01-31T16:39:28.458Z",
    "requireSignedURLs": false,
    "variants": [
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/public",
      "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/thumbnail"
    ]
  }
}
```

## Supported Formats

Cloudflare Images supports the following formats:
- JPEG
- PNG
- GIF (including animated GIFs)
- WebP

## Error Handling

The API returns appropriate error messages for:
- Missing image or URL
- Unsupported file formats
- Files exceeding the size limit (10MB)
- Authentication failures
- Server errors 