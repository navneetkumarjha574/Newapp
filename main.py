from datetime import datetime
import os
import random
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

# Pre-defined Birthday Countdown Template Messages
COUNTDOWN_TEMPLATES = [
    "⏰ Only {days} Days, {hours} Hours, and {minutes} Minutes left for your special day! 🥳 "
    "I'm really very sorry! Please mujhe maaf kar do 🥺",
]


def generate_birthday_message(days, hours, minutes):
    template = random.choice(COUNTDOWN_TEMPLATES)
    return template.format(days=days, hours=hours, minutes=minutes)


# 1. Target Birthday Date: 16 September 2026 (12:00 AM / Midnight)
TARGET_YEAR = 2026
TARGET_MONTH = 9
TARGET_DAY = 16
TARGET_HOUR = 0
TARGET_MINUTE = 0

target_time = datetime(
    TARGET_YEAR, TARGET_MONTH, TARGET_DAY, TARGET_HOUR, TARGET_MINUTE
)

# 2. Chrome Options for Headless & Cloud Optimization
options = webdriver.ChromeOptions()
profile_dir = os.path.join(os.getcwd(), "WhatsApp_Bot_Session")
options.add_argument(f"--user-data-dir={profile_dir}")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
)

# Linux Cloud Environment Check for Chromium
if os.environ.get("CHROME_BIN"):
    options.binary_location = os.environ.get("CHROME_BIN")

# Driver Initializing
chrome_driver_path = os.environ.get("CHROMEDRIVER_PATH")
if chrome_driver_path:
    service = Service(executable_path=chrome_driver_path)
else:
    service = Service(ChromeDriverManager().install())

driver = webdriver.Chrome(service=service, options=options)

PHONE_NUMBER = "918340189561"
url = f"https://web.whatsapp.com/send?phone={PHONE_NUMBER}"
driver.get(url)

try:
    print("Waiting for WhatsApp Web to load...")
    textbox_xpaths = [
        '//div[@contenteditable="true"][@data-tab="10"]',
        '//div[@aria-label="Type a message"]',
        '//footer//div[@contenteditable="true"]',
    ]

    input_box = None
    for xpath in textbox_xpaths:
        try:
            input_box = WebDriverWait(driver, 35).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
            if input_box:
                break
        except Exception:
            continue

    if not input_box:
        raise Exception("WhatsApp Text Field not found. Please check session login.")

    def send_whatsapp_message(text):
        # Direct DOM Injection (Cloud Headless Safe Method)
        driver.execute_script(
            "arguments[0].focus(); document.execCommand('insertText', false, arguments[1]);",
            input_box,
            text,
        )
        time.sleep(0.5)
        input_box.send_keys(Keys.ENTER)

    print("Countdown Active! Running 24/7 in Cloud/Background...")

    while True:
        now = datetime.now()
        time_diff = target_time - now
        total_seconds = int(time_diff.total_seconds())

        # Target Time Hit Check
        if total_seconds <= 0:
            final_wish = (
                "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
            )
            send_whatsapp_message(final_wish)
            print("🎉 Final Wish Sent Successfully!")
            break

        # Time Calculation Logic
        days = time_diff.days
        hours, remainder = divmod(time_diff.seconds, 3600)
        minutes, _ = divmod(remainder, 60)

        msg = generate_birthday_message(days, hours, minutes)
        send_whatsapp_message(msg)

        print(
            f"[{days} Days, {hours} Hours, {minutes} Mins Remaining] Sent: {msg}"
        )
        time.sleep(60)  # Continuous loop every 60 seconds

except Exception as e:
    print("Execution Error:", e)
