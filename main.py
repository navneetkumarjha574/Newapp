import time
from whatsapp_api_client_python import API

ID_INSTANCE="710522729580"
API_TOKEN_INSTANCE="4f99fd3a1a5d4e30b1f3cd0c83ddaab69aaa0ffba5c646f68f"
greenAPI=API.GreenApi(ID_INSTANCE,API_TOKEN_INSTANCE)

PHONE_NUMBER="918603818597@c.us"

print("🚀 Bot Active! Sending Beta Pintu every 1 second...")

try:
    while True:
        try:
            response=greenAPI.sending.sendMessage(PHONE_NUMBER,"Beta Pintu")
            print("Beta Pintu Sent! Status:",response.data)
        except Exception as send_err:
            print("Error:",send_err)
        time.sleep(1)

except KeyboardInterrupt:
    print("🛑 Bot Stopped!")
except Exception as e:
    print("Execution Error:",e)
