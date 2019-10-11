require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");

(async () => {
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false }
    const page_1 = await bowser.newPage();
    // const page = await bowser.newPage();
    await page_1.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    const p1 = await site_1(page_1);

    Promise.all([p1])
        .then(res => console.log(res[0]))
        .then(res => bowser.close())
        .catch(err => console.error(err));
})();
