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

COUNTDOWN_TEMPLATES=["Only  {hours} Hours, {minutes} Minutes, {seconds} Seconds Babu 💗"]

def generate_birthday_message(days,hours,minutes,seconds): return random.choice(COUNTDOWN_TEMPLATES).format(days=days,hours=hours,minutes=minutes,seconds=seconds)

print("🚀 Bot Active! Random message once every 5 minutes")

try:
    while True:
        now=datetime.now(IST)
        total_seconds=int((target_time-now).total_seconds())

        if total_seconds<=0:
            response=greenAPI.sending.sendMessage(PHONE_NUMBER,"🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨")
            print("🎉 Final Wish Sent!",response.data)
            break

        days,rem=divmod(total_seconds,86400)
        hours,rem=divmod(rem,3600)
        minutes,seconds=divmod(rem,60)

        wait=random.randint(1,300)
        print(f"⏳ Waiting {wait} seconds for random message...")
        time.sleep(wait)

        now=datetime.now(IST)
        total_seconds=int((target_time-now).total_seconds())

        if total_seconds<=0:
            response=greenAPI.sending.sendMessage(PHONE_NUMBER,"🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨")
            break

        days,rem=divmod(total_seconds,86400)
        hours,rem=divmod(rem,3600)
        minutes,seconds=divmod(rem,60)

        msg=generate_birthday_message(days,hours,minutes,seconds)
        response=greenAPI.sending.sendMessage(PHONE_NUMBER,msg)
        print(f"💗 Sent: {msg}")

except KeyboardInterrupt:
    print("🛑 Bot Stopped!")
except Exception as e:
    print("Execution Error:",e)
