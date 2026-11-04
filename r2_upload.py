import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

# Cloudflare R2 Configuration
# You need to get these from Cloudflare R2 dashboard
# Go to: Cloudflare Dashboard → R2 → Manage R2 API Tokens
ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', '')
SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', '')
BUCKET_NAME = os.environ.get('R2_BUCKET_NAME', '')
ACCOUNT_ID = os.environ.get('R2_ACCOUNT_ID', '')

# Local data files
DATA_FILES = [
    'data_forest.json',
    'data_other_dept.json',
    'data_agriculture.json',
    'data_plant_atree.json',
    'data_palm_forest.json',
    'data_palm_other_dept.json'
]

def upload_to_r2():
    """Upload data files to Cloudflare R2"""
    
    if not all([ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, ACCOUNT_ID]):
        print("❌ Error: Missing R2 credentials!")
        print("\nPlease set environment variables:")
        print("  set R2_ACCESS_KEY_ID=your_access_key")
        print("  set R2_SECRET_ACCESS_KEY=your_secret_key")
        print("  set R2_BUCKET_NAME=your_bucket_name")
        print("  set R2_ACCOUNT_ID=your_account_id")
        print("\nOr use the provided credentials from Cloudflare R2 dashboard")
        return False
    
    try:
        # Create S3 client for R2
        s3 = boto3.client(
            's3',
            endpoint_url=f'https://{ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=ACCESS_KEY_ID,
            aws_secret_access_key=SECRET_ACCESS_KEY
        )
        
        print(f"📤 Uploading to R2 bucket: {BUCKET_NAME}")
        print("=" * 50)
        
        # Upload each file
        for filename in DATA_FILES:
            filepath = os.path.join(os.path.dirname(__file__), filename)
            
            if not os.path.exists(filepath):
                print(f"⚠️  Skipping {filename} (file not found)")
                continue
            
            file_size = os.path.getsize(filepath) / (1024 * 1024)  # Convert to MB
            print(f"\n📄 Uploading {filename} ({file_size:.2f} MB)...")
            
            try:
                s3.upload_file(
                    BucketName=BUCKET_NAME,
                    Key=filename,
                    Filename=filepath
                )
                print(f"✅ Successfully uploaded {filename}")
            except ClientError as e:
                print(f"❌ Error uploading {filename}: {e}")
                return False
        
        print("\n" + "=" * 50)
        print("✅ All files uploaded successfully!")
        print(f"\n🌐 R2 Public URL: https://{BUCKET_NAME}.{ACCOUNT_ID}.r2.cloudflarestorage.com/")
        print("\n⚠️  Note: Make sure your bucket is set to public access")
        
        return True
        
    except NoCredentialsError:
        print("❌ Error: Invalid R2 credentials")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Cloudflare R2 Data Upload Script")
    print("=" * 50)
    
    if upload_to_r2():
        print("\n✨ Upload complete!")
    else:
        print("\n❌ Upload failed!")
        print("\nPlease check your R2 credentials and try again.")
