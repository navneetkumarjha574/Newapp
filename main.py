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

COUNTDOWN_TEMPLATES = [
    "⏰ Only {days} Days, {hours} Hours, and {minutes} Minutes left for your special day! 🥳 "
    "I'm really very sorry! Please mujhe maaf kar do 🥺",
]


def generate_birthday_message(days, hours, minutes):
    template = random.choice(COUNTDOWN_TEMPLATES)
    return template.format(days=days, hours=hours, minutes=minutes)


TARGET_YEAR = 2026
TARGET_MONTH = 9
TARGET_DAY = 16
TARGET_HOUR = 0
TARGET_MINUTE = 0

target_time = datetime(
    TARGET_YEAR, TARGET_MONTH, TARGET_DAY, TARGET_HOUR, TARGET_MINUTE
)

options = webdriver.ChromeOptions()
profile_dir = os.path.join(os.getcwd(), "WhatsApp_Bot_Session")
options.add_argument(f"--user-data-dir={profile_dir}")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")

# Anti-Bot Detection Bypass Headers
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

if os.environ.get("CHROME_BIN"):
    options.binary_location = os.environ.get("CHROME_BIN")

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
    time.sleep(15)

    # Latest WhatsApp Web Contenteditable Selectors (2026 Compatible)
    textbox_xpaths = [
        '//footer//div[@contenteditable="true"]',
        '//div[@contenteditable="true"]',
        '//div[@aria-placeholder="Type a message"]',
        '//div[@data-lexical-editor="true"]',
    ]

    input_box = None

    # Wait 3 minutes for user session scan/load
    for attempt in range(18):
        for xpath in textbox_xpaths:
            try:
                elements = driver.find_elements(By.XPATH, xpath)
                for el in elements:
                    if el.is_displayed():
                        input_box = el
                        break
                if input_box:
                    break
            except Exception:
                continue
        if input_box:
            print("✅ WhatsApp Web Logged In Successfully!")
            break
        print(f"Waiting for login... ({attempt * 10}s elapsed)")
        time.sleep(10)

    if not input_box:
        # Fallback: Save screenshot for debug
        driver.save_screenshot("login_error.png")
        raise Exception(
            "WhatsApp Text Field not found. Session login required or QR not scanned."
        )

    def send_whatsapp_message(text):
        driver.execute_script(
            "arguments[0].focus(); document.execCommand('insertText', false, arguments[1]);",
            input_box,
            text,
        )
        time.sleep(0.5)
        input_box.send_keys(Keys.ENTER)

    print("Countdown Active! Running 24/7 in Background...")

    while True:
        now = datetime.now()
        time_diff = target_time - now
        total_seconds = int(time_diff.total_seconds())

        if total_seconds <= 0:
            final_wish = (
                "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
            )
            send_whatsapp_message(final_wish)
            print("🎉 Final Wish Sent Successfully!")
            break

        days = time_diff.days
        hours, remainder = divmod(time_diff.seconds, 3600)
        minutes, _ = divmod(remainder, 60)

        msg = generate_birthday_message(days, hours, minutes)
        send_whatsapp_message(msg)

        print(
            f"[{days} Days, {hours} Hours, {minutes} Mins Remaining] Sent: {msg}"
        )
        time.sleep(60)

except Exception as e:
    print("Execution Error:", e)
