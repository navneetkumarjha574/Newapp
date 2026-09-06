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
from whatsapp_api_client_python import API

greenAPI = API.GreenApi(ID_INSTANCE, API_TOKEN_INSTANCE)

PHONE_NUMBER = "919973600388@c.us"
TARGET_DATE = datetime(2026, 9, 16, 0, 0, 0)

COUNTDOWN_TEMPLATES = [
    "⏰ Only {days} Days, {hours} Hours, and {minutes} Minutes left for your special day! 🥳 "
    "I'm really very sorry! Please mujhe maaf kar do 🥺",
]


def generate_birthday_message(days, hours, minutes):
    template = random.choice(COUNTDOWN_TEMPLATES)
    return template.format(days=days, hours=hours, minutes=minutes)


last_sent_minute = -1  # Prevent Duplicate Message Guard

print("🚀 Bot initialized safely...")

while True:
    now = datetime.now()

    # Minute Guard Check: Agar is minute me message ja chuka hai toh wait karega
    if now.minute != last_sent_minute:
        time_diff = TARGET_DATE - now
        total_seconds = int(time_diff.total_seconds())

        if total_seconds <= 0:
            msg = "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
            greenAPI.sending.sendMessage(PHONE_NUMBER, msg)
            print("🎉 Final Wish Sent!")
            break

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
            # Register current minute as sent
            last_sent_minute = now.minute
        except Exception as e:
            print("Error sending message:", e)

    # Short sleep interval for exact time tracking
    time.sleep(10)
