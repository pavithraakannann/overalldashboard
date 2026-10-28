import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import requests
import shutil

# Configuration
DOWNLOADS_DIR = r"c:\Users\LENOVO\Downloads"
EXPORT_URL = "https://www.greentnmission.com/Export"
BASE_URL = "https://www.greentnmission.com"

# Get credentials from environment variables (more secure)
USERNAME = os.environ.get('GREEN_USERNAME', '')
PASSWORD = os.environ.get('GREEN_PASSWORD', '')

def setup_driver():
    """Setup Chrome WebDriver with download preferences"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-infobars")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--disable-popup-blocking")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--allow-running-in-content")
    chrome_options.add_argument("--disable-features=VizDisplayCompositor")
    chrome_options.add_argument("--disable-features=TranslateUI")
    chrome_options.add_argument("--disable-background-timer-throttling")
    chrome_options.add_argument("--disable-backgrounding-occlusion")
    chrome_options.add_argument("--disable-renderer-backgrounding")
    chrome_options.add_argument("--disable-features=IsolateOrigins")
    chrome_options.add_argument("--disable-features=BlinkGenPropertyTrees")
    chrome_options.add_argument("--disable-features=ExperimentalNativeNotifications")
    chrome_options.add_argument("--disable-features=NewTab")
    chrome_options.add_argument("--disable-features=NewIncognito")
    chrome_options.add_argument("--log-level=3")
    
    # Disable Chrome auto-update
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Set download directory
    prefs = {
        "download.default_directory": DOWNLOADS_DIR,
        "download.prompt_for_download": False,
        "directory_upgrade": True,
        "safebrowsing.enabled": True,
        "credentials_enable_service": False,
        "profile": {
            "default_content_setting_values": {
                "automatic_downloads": 2
            }
        }
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    service = Service()
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def login(driver):
    """Login to the website"""
    print("Navigating to login page...")
    driver.get(BASE_URL)
    
    time.sleep(2)
    
    # Find login form (adjust selectors based on actual website structure)
    try:
        # Look for username field
        username_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys(USERNAME)
        
        # Look for password field
        password_field = driver.find_element(By.NAME, "password")
        password_field.send_keys(PASSWORD)
        
        # Click login button
        login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        login_button.click()
        
        print("Login successful!")
        time.sleep(3)
        return True
    except Exception as e:
        print(f"Login failed: {e}")
        print("Trying alternative login method...")
        
        # Alternative: Direct login to export page
        return False

def download_exports(driver):
    """Download all export files"""
    print("Navigating to export page...")
    driver.get(EXPORT_URL)
    time.sleep(3)
    
    sections = [
        "Forest Department",
        "Coastal Habitat",
        "Other Departments",
        "Plant-a-Tree",
        "Agriculture Department"
    ]
    
    downloaded_files = []
    
    for section in sections:
        print(f"\nProcessing {section}...")
        try:
            # Find section and click configure
            section_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{section}')]"))
            )
            
            # Click configure button
            configure_button = section_element.find_element(By.XPATH, ".//a[contains(text(), 'Configure') or .//button[contains(text(), 'Configure')]")
            configure_button.click()
            
            time.sleep(2)
            
            # Select "All Years" if year filter exists
            try:
                year_select = driver.find_element(By.NAME, "year")
                # Select "All Years" option
                year_select.send_keys("All Years")
                time.sleep(1)
            except:
                print("No year filter found or all years already selected")
            
            # Click export button
            export_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Export') or .//a[contains(text(), 'Export')]")
            export_button.click()
            
            # Wait for download to complete
            time.sleep(5)
            
            # Get the latest downloaded file
            files = os.listdir(DOWNLOADS_DIR)
            csv_files = [f for f in files if f.endswith('.csv') and 'export' in f.lower()]
            if csv_files:
                latest_file = max(csv_files, key=lambda x: os.path.getctime(os.path.join(DOWNLOADS_DIR, x)))
                downloaded_files.append(os.path.join(DOWNLOADS_DIR, latest_file))
                print(f"  ✓ Downloaded: {latest_file}")
            
            # Go back to export page
            driver.get(EXPORT_URL)
            time.sleep(2)
            
        except Exception as e:
            print(f"  ✗ Error processing {section}: {e}")
    
    return downloaded_files

def convert_to_json(downloaded_files):
    """Convert downloaded CSV files to JSON"""
    print("\nConverting CSV files to JSON...")
    
    # Run the conversion script
    os.system("cd C:\\Users\\LENOVO\\Desktop\\pavi\\overalldashboard && node convert_excel_to_json.js")
    
    print("✓ Conversion complete!")

def main():
    """Main automation workflow"""
    print("=" * 50)
    print("Green TN Mission Auto-Export Script")
    print("=" * 50)
    
    print(f"\nUsername: {USERNAME}")
    print(f"Password: {'*' * len(PASSWORD) if PASSWORD else 'Not set'}")
    
    if not USERNAME or not PASSWORD:
        print("\n⚠️ WARNING: Credentials not set!")
        print("Please set environment variables:")
        print("  set GREEN_USERNAME=CMD")
        print("  set GREEN_PASSWORD=cf@23")
        print("\nOr run with:")
        print("  $env:GREEN_USERNAME=CMD; $env:GREEN_PASSWORD=cf@23; python auto_download.py")
        return
    
    try:
        # Setup driver
        print("\nSetting up browser...")
        driver = setup_driver()
        
        # Login
        if not login(driver):
            print("Direct login failed, trying export page directly...")
            driver.get(EXPORT_URL)
            time.sleep(3)
        
        # Download exports
        downloaded_files = download_exports(driver)
        
        # Close driver
        driver.quit()
        
        # Convert to JSON
        if downloaded_files:
            convert_to_json(downloaded_files)
        else:
            print("\nNo files were downloaded. Please check the website structure.")
        
        print("\n" + "=" * 50)
        print("Automation complete!")
        print("=" * 50)
        print("\nOpen summary_table.html in your browser and click 'Load Data from JSON'")
        
    except Exception as e:
        print(f"\nError during automation: {e}")
        print("\nPlease check:")
        print("1. Chrome browser is installed")
        print("2. ChromeDriver is installed and in PATH")
        print("3. Credentials are correct")
        print("4. Website structure hasn't changed")

if __name__ == "__main__":
    main()
