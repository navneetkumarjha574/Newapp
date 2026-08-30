const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

const TARGET_DATE = new Date(2026, 8, 16, 0, 0, 0);
const PHONE_NUMBER = "919973600388";

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

client.on('ready', () => {
    console.log('WhatsApp Bot Ready!');
    qrImageData = '';
    const chatId = `${PHONE_NUMBER}@c.us`;

    setInterval(async () => {
        const message = getRemainingTimeMessage();
        if (!message) {
            await client.sendMessage(chatId, "🎉 HAPPY BIRTHDAY! 🥳🎁✨");
            return;
        }
        try {
            await client.sendMessage(chatId, message);
        } catch (err) {
            console.error(err);
        }
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
        res.send('<h2>QR Code generate ho raha hai... 10s baad refresh karein.</h2>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

client.initialize();
