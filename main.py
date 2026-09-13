from datetime import datetime
from zoneinfo import ZoneInfo
import random,time
from whatsapp_api_client_python import API

# Green API
ID_INSTANCE="710522729580"
API_TOKEN_INSTANCE="4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"
greenAPI=API.GreenApi(ID_INSTANCE,API_TOKEN_INSTANCE)

# Target
PHONE_NUMBER="918340189561@c.us"
IST=ZoneInfo("Asia/Kolkata")
target_time=datetime(2026,9,16,0,0,0,tzinfo=IST)

# Messages
COUNTDOWN_TEMPLATES=["{days} D {hours} H {minutes} M Babu 💗"]

def generate_birthday_message(days,hours,minutes,seconds): return random.choice(COUNTDOWN_TEMPLATES).format(days=days,hours=hours,minutes=minutes,seconds=seconds)

last_sent_slot=-1
print("🚀 Bot Active! Countdown target: 16 September 2026 12:00 AM IST")

try:
    while True:
        now=datetime.now(IST)
        total_seconds=int((target_time-now).total_seconds())

        if total_seconds<=0:
            final_wish="🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨"
            response=greenAPI.sending.sendMessage(PHONE_NUMBER,final_wish)
            print("🎉 Final Wish Sent Successfully! Status:",response.data)
            break

        days,total_seconds=divmod(total_seconds,86400)
        hours,remaining=divmod(total_seconds,3600)
        minutes,seconds=divmod(remaining,60)

        current_slot=int(datetime.now(IST).timestamp())//600

        if current_slot!=last_sent_slot:
            msg=generate_birthday_message(days,hours,minutes,seconds)
            try:
                response=greenAPI.sending.sendMessage(PHONE_NUMBER,msg)
                print(f"[{days}D {hours}H {minutes}M {seconds}S Remaining] Sent! Status:",response.data)
                last_sent_slot=current_slot
            except Exception as send_err: print("Error sending message via Green API:",send_err)

        time.sleep(1)

except Exception as e: print("Execution Error:",e)
