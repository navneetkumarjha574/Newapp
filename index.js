const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Target Date: 16 September 2026 Midnight (12:00 AM)
const TARGET_DATE = new Date(2026, 8, 16, 0, 0, 0); // Month 0-indexed (8 = Sep)
const PHONE_NUMBER = "919973600388"; // Target WhatsApp Number (Country code ke saath)

// Real-Time Time Calculator (Days, Hours, Minutes)
function getRemainingTimeMessage() {
    const now = new Date();
    const diffMs = TARGET_DATE - now;

    if (diffMs <= 0) {
        return null; // Time complete
    }

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

// WhatsApp Client Setup (Cloud Friendly Arguments)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('Terminal par QR Code scan karein:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot Active! Countdown running every 1 minute...');
    const chatId = `${PHONE_NUMBER}@c.us`;

    const interval = setInterval(async () => {
        const message = getRemainingTimeMessage();

        // 16 Sep Midnight Reached
        if (!message) {
            clearInterval(interval);
            await client.sendMessage(chatId, "🎉 HAPPY BIRTHDAY! May all your dreams come true! 🥳🎁✨");
            console.log("🎉 Final Birthday Wish Sent!");
            return;
        }

        // Send Countdown Message
        await client.sendMessage(chatId, message);
        console.log(`Sent: ${message}`);

    }, 60000); // Exact 1 Minute Interval
});

client.initialize();
