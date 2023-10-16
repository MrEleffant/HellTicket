const puppeteer = require('puppeteer');

const ligne = 2
const colonne = 5

const desiredHour = 9;
const desiredMinute = 27;


async function openChromeWindow(url, index, j, hour, minute) {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-position=${index * 500},${j * 500}`,
            `--window-size=200,600`,
            "--force-device-scale-factor=1", // 0.25
        ],
        defaultViewport: null,
    });

    const page = await browser.newPage();

    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    const timeUntilOpen = targetTime - now;
    if (timeUntilOpen > 0) {
        console.log(`Waiting for ${timeUntilOpen / 1000} seconds until ${hour}:${minute}...`);
        await setTimeout(async() => {
            await page.goto(url);
        }, timeUntilOpen);
    } else {
        console.log('The specified time has already passed for today.');
    }
}

const urls = [
    'https://tickets.hellfest.fr/#one',
    'https://tickets.hellfest.fr/#two',
];

function openTabs(hour, minute) {
    if (urls.length > 0) {

        for (let j = 0; j < ligne; j++) {
            for (let i = 0; i < colonne; i++) {
                const urlToOpen = urls[i % urls.length];
                openChromeWindow(urlToOpen, i, j, hour, minute);
            }
        }

    } else {
        console.error('No URLs specified.');
    }
}


openTabs(desiredHour, desiredMinute);
