# Cloudflare R2 Upload Integration
import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

# R2 Configuration (will be set from environment variables)
R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', '')
R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', '')
R2_BUCKET_NAME = os.environ.get('R2_BUCKET_NAME', '')
R2_ACCOUNT_ID = os.environ.get('R2_ACCOUNT_ID', '')

def upload_to_r2():
    """Upload data files to Cloudflare R2"""
    
    if not all([R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ACCOUNT_ID]):
        print("⚠️  R2 credentials not set. Skipping R2 upload.")
        print("   To enable R2 upload, set environment variables:")
        print("   set R2_ACCESS_KEY_ID=your_access_key")
        print("   set R2_SECRET_ACCESS_KEY=your_secret_key")
        print("   set R2_BUCKET_NAME=your_bucket_name")
        print("   set R2_ACCOUNT_ID=your_account_id")
        return False
    
    try:
        # Create S3 client for R2
        s3 = boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY
        )
        
        print("📤 Uploading to Cloudflare R2...")
        
        # Upload each file
        data_files = [
            'data_forest.json',
            'data_other_dept.json',
            'data_agriculture.json',
            'data_plant_atree.json',
            'data_palm_forest.json',
            'data_palm_other_dept.json'
        ]
        
        for filename in data_files:
            filepath = os.path.join(os.path.dirname(__file__), filename)
            
            if not os.path.exists(filepath):
                print(f"⚠️  Skipping {filename} (file not found)")
                continue
            
            print(f"   Uploading {filename}...")
            
            try:
                s3.upload_file(
                    BucketName=R2_BUCKET_NAME,
                    Key=filename,
                    Filename=filepath
                )
                print(f"   ✅ {filename} uploaded")
            except ClientError as e:
                print(f"   ❌ Error uploading {filename}: {e}")
                return False
        
        print("✅ All files uploaded to R2!")
        return True
        
    except NoCredentialsError:
        print("❌ Error: Invalid R2 credentials")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
