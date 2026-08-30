const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Target Date: 16 September 2026 Midnight (12:00 AM)
const TARGET_DATE = new Date(2026, 8, 16, 0, 0, 0);
const PHONE_NUMBER = "918340189561"; // Target Number with Country Code (91)

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
            '--disable-gpu',
            '--disable-extensions',
            '--disable-component-update',
            '--no-default-browser-check',
            '--disable-site-isolation-trials',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--memory-pressure-off',
            '--js-flags="--max-old-space-size=128 --optimize-for-size"'
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

// Safe Message Sending Logic
async function sendCountdownMessage() {
    const message = getRemainingTimeMessage();
    const textToSend = message || "🎉 HAPPY BIRTHDAY! 🥳🎁✨";

    try {
        // Step 1: Check if number exists on WhatsApp
        const numberDetails = await client.getNumberId(PHONE_NUMBER);
        
        if (numberDetails) {
            // Step 2: Send directly to the verified serialized ID
            await client.sendMessage(numberDetails._serialized, textToSend);
            console.log(`[SUCCESS] Message Sent to ${PHONE_NUMBER}: ${textToSend}`);
        } else {
            console.error(`[ERROR] Number ${PHONE_NUMBER} WhatsApp par registered nahi mil raha hai.`);
        }
    } catch (err) {
        console.error(`[CRITICAL ERROR] Message send fail hua:`, err.message);
    }
}

client.on('ready', () => {
    console.log('✅ WhatsApp Bot Successfully Connected!');
    qrImageData = '';

    // 1. Send immediate message upon connecting
    sendCountdownMessage();

    // 2. Loop every 1 minute
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
        res.send('<h2>Bot Logged In Hai! Messages background me ja rahe hain.</h2>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Prevent Render Free Tier Sleep Mode
    setInterval(() => {
        http.get(`http://localhost:${PORT}`);
    }, 300000);
});

client.initialize();
