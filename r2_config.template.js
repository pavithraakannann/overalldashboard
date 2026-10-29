// Cloudflare R2 Configuration Template
// 
// SETUP INSTRUCTIONS:
// 1. Copy this file to r2_config.js
// 2. Update the values below with your actual R2 credentials
// 3. DO NOT commit r2_config.js to git (it contains credentials)
//
// Get these values from Cloudflare R2 dashboard:
// - Account ID: Found in R2 dashboard URL
// - Bucket Name: Your bucket name
// - Public URL: https://YOUR_BUCKET_NAME.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
//
const R2_CONFIG = {
    accountId: 'YOUR_ACCOUNT_ID_HERE',      // From Cloudflare R2 dashboard
    bucketName: 'YOUR_BUCKET_NAME_HERE',      // Your bucket name
    publicUrl: 'https://YOUR_BUCKET_NAME_HERE.YOUR_ACCOUNT_ID_HERE.r2.cloudflarestorage.com'
};

// Get R2 URL for a specific file
function getR2Url(filename) {
    return `${R2_CONFIG.publicUrl}/${filename}`;
}
