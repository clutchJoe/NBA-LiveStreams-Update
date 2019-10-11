require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const site_1 = require("./crawlingPages/site_1");

module.exports = async () => {
    let data = [];
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false }
    const page_1 = await bowser.newPage();
    // const page = await bowser.newPage();
    await page_1.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    console.log(`Start crawling site ${process.env.SITE_1}`);
    const p1 = await site_1(page_1);

    await Promise.all([p1])
        .then(res => {
            console.log(res[0]);
            console.log("End of crawl...");
            data = res[0];
        })
        .then(res => bowser.close())
        .catch(err => console.error(err));

    const json = { uuid: "64350b50-a810-4901-b86b-7a5106bdef2c", title: "NBA Live Broadcast Link Update" };
    const fomatData = [];
    data.map(item => {
        const tar = {};
        tar.name = `${item.head}  (${item.updateTime})`;
        tar.url = item.link;
        fomatData.push(tar);
    });
    json.channels = fomatData;
    fs.writeFile("./archive/list.json", JSON.stringify(json, null, "  "), err => {
        if (err) throw err;
        console.log("File created and data written...");
        console.log(new Date() + "\n");
    });

    return await data;
};
