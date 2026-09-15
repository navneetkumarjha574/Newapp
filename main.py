from datetime import datetime
from zoneinfo import ZoneInfo
import random
import time
from whatsapp_api_client_python import API

# Green API
ID_INSTANCE = "YOUR_INSTANCE_ID"
API_TOKEN_INSTANCE = "YOUR_API_TOKEN"

greenAPI = API.GreenApi(ID_INSTANCE, API_TOKEN_INSTANCE)

# Target
PHONE_NUMBER = "918340189561@c.us"

IST = ZoneInfo("Asia/Kolkata")
target_time = datetime(2026, 9, 16, 0, 0, 0, tzinfo=IST)

# Countdown Message
COUNTDOWN_TEMPLATES = [
    "Only {hours} Hours, {minutes} M Left Babu 💗"
]

def generate_birthday_message(hours, minutes):
    return random.choice(COUNTDOWN_TEMPLATES).format(
        hours=hours,
        minutes=minutes
    )

# Final Birthday Wish
FINAL_BIRTHDAY_MESSAGE = """Happy Birthday to the most special person in my life. ❤️🎂✨

You are the first and the last person I’ve ever connected with this deeply. 🥹💗 I don’t know how to explain it in words, but there’s something about you that feels truly different and special to me.

You came into my life and somehow made everything a little more beautiful. 🌸✨ The little conversations, the random moments, your smile, and even the smallest things about you have slowly become very precious to me. 🫶🏻❤️

I just want to see you happy, always… because your smile means more to me than you know. 🥹💗 No matter what happens, I’ll always wish the best for you and always care for you from the bottom of my heart.

You will always have a very special place in my heart, a place that no one else can ever take. ❤️♾️

May this birthday bring you all the happiness, peace and beautiful moments you deserve. ✨🌷
Stay happy, keep smiling, and never forget how special you are to me. ❤️🥹"""

last_sent_slot = -1
final_wish_sent = False

print("🚀 Bot Active! Countdown target: 16 September 2026 12:00 AM IST")

try:
    while True:
        now = datetime.now(IST)
        total_seconds = int((target_time - now).total_seconds())

        # 🎉 Birthday time reached
        if total_seconds <= 0:
            if not final_wish_sent:
                try:
                    response = greenAPI.sending.sendMessage(
                        PHONE_NUMBER,
                        FINAL_BIRTHDAY_MESSAGE
                    )

                    print(
                        "🎉 Final Birthday Wish Sent Successfully! Status:",
                        response.data
                    )

                    final_wish_sent = True

                except Exception as send_err:
                    print("Error sending birthday wish:", send_err)

            break

        # Convert remaining time into hours + minutes
        total_minutes = (total_seconds + 59) // 60
        hours, minutes = divmod(total_minutes, 60)

        # Send countdown once every minute
        current_slot = int(now.timestamp()) // 60

        if current_slot != last_sent_slot:
            msg = generate_birthday_message(hours, minutes)

            try:
                response = greenAPI.sending.sendMessage(
                    PHONE_NUMBER,
                    msg
                )

                print(
                    f"[{hours}H {minutes}M Remaining] Sent! Status:",
                    response.data
                )

                last_sent_slot = current_slot

            except Exception as send_err:
                print("Error sending countdown:", send_err)

        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Bot stopped manually.")

except Exception as e:
    print("Execution Error:", e)
