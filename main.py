from datetime import datetime
import random
import time
from whatsapp_api_client_python import API

# Green API Credentials
ID_INSTANCE = "710522729580"
API_TOKEN_INSTANCE = "4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"

greenAPI = API.GreenApi(ID_INSTANCE, API_TOKEN_INSTANCE)

# Target Contact Details
PHONE_NUMBER = "918340189561@c.us"

# Countdown Target Date: 16 September 2026 (Midnight)
TARGET_YEAR = 2026
TARGET_MONTH = 9
TARGET_DAY = 16
TARGET_HOUR = 0
TARGET_MINUTE = 0

target_time = datetime(
    TARGET_YEAR, TARGET_MONTH, TARGET_DAY, TARGET_HOUR, TARGET_MINUTE
)

# Pre-defined Birthday Countdown Template Messages
COUNTDOWN_TEMPLATES = [
    "⏰ Only {days} Days, {hours} Hours, and {minutes} left Babu 💗🥳",
]


def generate_birthday_message(days, hours, minutes):
    template = random.choice(COUNTDOWN_TEMPLATES)
    return template.format(days=days, hours=hours, minutes=minutes)


# Minute Guard: Duplicate message prevent karne ke liye lock
last_sent_minute = -1

print("🚀 Bot Active with Green API! Sending 1 message every 5 minutes...")

try:
    while True:
        now = datetime.now()

        # Condition 1: Check if current minute is a multiple of 5 (0, 5, 10, 15, ..., 55)
        # Condition 2: Check if this minute hasn't already sent a message
        if now.minute % 5 == 0 and now.minute != last_sent_minute:
            time_diff = target_time - now
            total_seconds = int(time_diff.total_seconds())

            # Target Date Reached
            if total_seconds <= 0:
                final_wish = (
                    "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
                )
                response = greenAPI.sending.sendMessage(
                    PHONE_NUMBER, final_wish
                )
                print("🎉 Final Wish Sent Successfully! Status:", response.data)
                break

            # Exact Days, Hours & Minutes Calculation
            days = time_diff.days
            hours, remainder = divmod(time_diff.seconds, 3600)
            minutes, _ = divmod(remainder, 60)

            msg = generate_birthday_message(days, hours, minutes)

            try:
                response = greenAPI.sending.sendMessage(PHONE_NUMBER, msg)
                print(
                    f"[{days} Days, {hours} Hours, {minutes} Mins Remaining] Sent! Status:",
                    response.data,
                )
                # Lock current minute to avoid multiple triggers
                last_sent_minute = now.minute
            except Exception as send_err:
                print("Error sending message via Green API:", send_err)

        # Check interval every 20 seconds
        time.sleep(20)

except Exception as e:
    print("Execution Error:", e)  
