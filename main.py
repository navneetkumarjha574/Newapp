from datetime import datetime
from zoneinfo import ZoneInfo
import random,time
from whatsapp_api_client_python import API

ID_INSTANCE="710522729580"
API_TOKEN_INSTANCE="4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"
greenAPI=API.GreenApi(ID_INSTANCE,API_TOKEN_INSTANCE)

PHONE_NUMBER="918340189561@c.us"
IST=ZoneInfo("Asia/Kolkata")
target_time=datetime(2026,9,16,0,0,0,tzinfo=IST)

COUNTDOWN_TEMPLATES=["Only {hours} Hours, {minutes} M Left Babu 💗"]

def generate_birthday_message(hours,minutes): return random.choice(COUNTDOWN_TEMPLATES).format(hours=hours,minutes=minutes)

last_sent_slot=-1
print("🚀 Bot Active! Countdown target: 16 September 2026 12:00 AM IST")

try:
    while True:
        now=datetime.now(IST)
        total_seconds=int((target_time-now).total_seconds())

        if total_seconds<=0:
            response=greenAPI.sending.sendMessage(PHONE_NUMBER,"🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨")
            print("🎉 Final Wish Sent Successfully! Status:",response.data)
            break

        total_minutes=(total_seconds+59)//60
        hours,minutes=divmod(total_minutes,60)

        current_slot=int(now.timestamp())//60

        if current_slot!=last_sent_slot:
            msg=generate_birthday_message(hours,minutes)
            try:
                response=greenAPI.sending.sendMessage(PHONE_NUMBER,msg)
                print(f"[{hours}H {minutes}M Remaining] Sent! Status:",response.data)
                last_sent_slot=current_slot
            except Exception as send_err: print("Error sending message:",send_err)

        time.sleep(1)

except Exception as e: print("Execution Error:",e)
