import os
import time
import random
from datetime import datetime
from whatsapp_api_client_python import API

# Green API Credentials
ID_INSTANCE = "710522729580"
API_TOKEN_INSTANCE = "4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"

from datetime import datetime
import random
import time
from apscheduler.schedulers.background import BackgroundScheduler

greenAPI = API.GreenApi(ID_INSTANCE, API_TOKEN_INSTANCE)

PHONE_NUMBER = "918340189561@c.us"
TARGET_DATE = datetime(2026, 9, 16, 0, 0, 0)

COUNTDOWN_TEMPLATES = [
    "⏰ Only {days} Days, {hours} Hours, and {minutes} Minutes left for your special day! 🥳 "
    "I'm really very sorry! Please mujhe maaf kar do 🥺",
]


def generate_birthday_message(days, hours, minutes):
    template = random.choice(COUNTDOWN_TEMPLATES)
    return template.format(days=days, hours=hours, minutes=minutes)


def send_countdown_job():
    now = datetime.now()
    time_diff = TARGET_DATE - now
    total_seconds = int(time_diff.total_seconds())

    if total_seconds <= 0:
        final_msg = "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
        try:
            greenAPI.sending.sendMessage(PHONE_NUMBER, final_msg)
            print("🎉 Final Wish Sent Successfully!")
            scheduler.shutdown()
        except Exception as e:
            print("Error sending final wish:", e)
        return

    days = time_diff.days
    hours, remainder = divmod(time_diff.seconds, 3600)
    minutes, _ = divmod(remainder, 60)

    msg = generate_birthday_message(days, hours, minutes)

    try:
        response = greenAPI.sending.sendMessage(PHONE_NUMBER, msg)
        print(
            f"[{days} Days, {hours} Hours, {minutes} Mins] Sent! Status:",
            response.data,
        )
    except Exception as e:
        print("Error sending message:", e)


# Exact 60 seconds interval scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(send_countdown_job, "interval", seconds=60)
scheduler.start()

print("🚀 Bot started! Running exactly 1 message per minute...")

try:
    while True:
        time.sleep(1)
except (KeyboardInterrupt, SystemExit):
    scheduler.shutdown()
