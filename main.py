from datetime import datetime, timezone, timedelta
import random
import time
from whatsapp_api_client_python import API

# Green API Credentials
ID_INSTANCE = "710522729580"
API_TOKEN_INSTANCE = "4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"

greenAPI = API.GreenApi(ID_INSTANCE, API_TOKEN_INSTANCE)
PHONE_NUMBER = "918340189561@c.us"
IST = timezone(timedelta(hours=5, minutes=30))
# Birthday: 16 September 2026, 12:00 AM IST
target_time = datetime(
    2026,
    9,
    16,
    0,
    0,
    0,
    tzinfo=IST
)

# Prevent duplicate message
last_sent_slot = None

print("🚀 Birthday Countdown Bot Started!")
print("🎯 Target:", target_time)

try:

    while True:

        # Current IST time
        now = datetime.now(IST)

        # Remaining time
        time_diff = target_time - now

        total_seconds = int(time_diff.total_seconds())
        if total_seconds <= 0:

            final_wish = (
                "🎉 HAPPY BIRTHDAY! 🥳🎂💗\n"
                "May all your dreams come true! ✨🎁"
            )

            try:
                response = greenAPI.sending.sendMessage(
                    PHONE_NUMBER,
                    final_wish
                )

                print(
                    "🎉 Final Birthday Wish Sent!",
                    response.data
                )

            except Exception as e:
                print("❌ Error sending final wish:", e)

            break

        # ==============================
        # CALCULATE COUNTDOWN
        # ==============================

        days, remainder = divmod(total_seconds, 86400)
        hours, remainder = divmod(remainder, 3600)
        minutes, seconds = divmod(remainder, 60)

        # ==============================
        # EVERY 5 MINUTES
        # ==============================

        current_slot = (
            now.year,
            now.month,
            now.day,
            now.hour,
            now.minute // 5
        )

        if now.minute % 1== 0 and current_slot != last_sent_slot:

            msg = (
                f"⏰ Only {days} Days, "
                f"{hours} Hours, and {minutes} Minutes "
                f"left Babu 💗🥳"
            )

            try:

                response = greenAPI.sending.sendMessage(
                    PHONE_NUMBER,
                    msg
                )

                print(
                    f"[{now.strftime('%d-%m-%Y %H:%M:%S')}] "
                    f"{days}D {hours}H {minutes}M remaining"
                )

                print("WhatsApp:", response.data)

                last_sent_slot = current_slot

            except Exception as send_err:

                print(
                    "❌ Error sending message:",
                    send_err
                )

        # Check every 1 second
        time.sleep(1)

except KeyboardInterrupt:

    print("\n🛑 Bot stopped manually.")

except Exception as e:

    print("❌ Execution Error:", e)
