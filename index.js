const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_DATE = new Date(2026, 8, 16, 0, 0, 0);
const PHONE_NUMBER = "918340189561"; // Country code ke saath

let qrImageData = '';

function getRemainingTimeMessage() {
    const now = new Date();
    const diffMs = TARGET_DATE - now;

    if (diffMs <= 0) return null;

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    let timeParts = [];
    if (days > 0) timeParts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) timeParts.push(`${hours} h`);
    timeParts.push(`${minutes} min`);

    return `⏰ ${timeParts.join(' ')} left for your special day! 🥳`;
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    QRCode.toDataURL(qr, (err, url) => {
        if (!err) {
            qrImageData = url;
            console.log('Web QR Code Ready!');
        }
    });
});

// Safe Message Sending Helper Function
async function sendCountdownMessage() {
    const chatId = `${PHONE_NUMBER}@c.us`;
    const message = getRemainingTimeMessage();

    try {
        // Chat object load karke message bhejna (Fix for unread/unopened chats)
        const chat = await client.getChatById(chatId);
        
        if (!message) {
            await chat.sendMessage("🎉 HAPPY BIRTHDAY! 🥳🎁✨");
            console.log("🎉 Birthday Wish Sent!");
            return;
        }

        await chat.sendMessage(message);
        console.log(`[SUCCESS] Message Sent: ${message}`);
    } catch (err) {
        console.error(`[ERROR] Direct send failed, fallback send try kar rahe hain:`, err.message);
        // Fallback method
        try {
            await client.sendMessage(chatId, message || "🎉 HAPPY BIRTHDAY! 🥳🎁✨");
            console.log(`[SUCCESS Fallback] Message Sent: ${message}`);
        } catch (fallbackErr) {
            console.error(`[CRITICAL ERROR] Message bhejne me dikkat aayi:`, fallbackErr.message);
        }
    }
}

client.on('ready', () => {
    console.log('✅ WhatsApp Bot Successfully Ready & Connected!');
    qrImageData = '';

    // 1. Ready hote hi immediately pehla message bhejega
    sendCountdownMessage();

    // 2. Continuous 1-minute interval loop
    setInterval(() => {
        sendCountdownMessage();
    }, 60000);
});

app.get('/', (req, res) => {
    if (qrImageData) {
        res.send(`
            <html>
            <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#111b21;">
                <div style="text-align:center;background:#202c33;padding:20px;border-radius:10px;">
                    <h2 style="color:#00a884;">Scan QR Code</h2>
                    <img src="${qrImageData}" style="width:280px;height:280px;"/>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send('<h2>Bot Ready/Logged in hai! QR code ki zaroorat nahi hai.</h2>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Render Server Sleep Mode Bypass (Har 5 Min me Self Ping)
    setInterval(() => {
        http.get(`http://localhost:${PORT}`);
    }, 300000);
});

client.initialize();
