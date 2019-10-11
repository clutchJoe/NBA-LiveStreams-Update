const puppeteer = require("puppeteer");

(async () => {
    // const url = "http://mssev.com/live/2019/";
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false }
    const page = await bowser.newPage();
    const page1 = await bowser.newPage();
    const p1 = new Promise((resolve, reject) => {
        resolve(page.goto("http://nbastreams.xyz/", { waitUntil: "networkidle2" }));
    })
        .then(async res => {
            const data = await page.evaluate(() => {
                let lists = [];
                const items = Array.from(document.querySelectorAll(".container .col-md-8 a"));
                for (let item of items) {
                    let data = {};
                    data.head = item.children[0].children[1].children[0].innerText;
                    data.updateTime = item.children[0].children[1].children[1].innerText;
                    data.link = item.getAttribute("href");
                    lists.push(data);
                }
                return lists;
            });
            return data;
        })
        .then(async data => {
            for (let item of data) {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                const iframes = await page.frames();
                for(let iframe of iframes){
                    if(iframe._navigationURL.endsWith(".php")){
                        await page.goto(iframe._navigationURL, { waitUntil: "networkidle2" });
                        const sourceLink = await page.evaluate(() => {
                            const script = document.querySelector("body script");
                            const source = script.textContent.split(",")[0].split('"')[1];
                            return source;
                        });
                        item.link = sourceLink;
                    };
                };
            }
            return data;
        })
        .catch(err => console.error(err));

    const p2 = new Promise((resolve, reject) => {
        resolve(page1.goto("http://givemereddit.stream/nba", { waitUntil: "networkidle2" }));
    })
        .then(async res => {
            const data = await page1.evaluate(() => {
                let lists = [];
                const items = Array.from(document.querySelectorAll("a.w-full.rounded"));
                for (let item of items) {
                    let data = {};
                    data.head = item.children[0].children[1].children[0].innerText;
                    data.updateTime = item.children[0].children[1].children[1].innerText;
                    data.link = item.getAttribute("href");
                    lists.push(data);
                }
                return lists;
            });
            return data;
        })
        .then(async data => {
            for (let item of data) {
                await page1.goto(item.link, { waitUntil: "networkidle2" });
                const sourceLink = await page1.evaluate(() => {
                    const scripts = Array.from(document.querySelectorAll("body script"));
                    const tar = scripts.filter(script => script.textContent.trim().startsWith("window.onload = function"));
                    const source = tar[0].textContent.trim().split(",")[0].split("'")[1];
                    // const source = script[1].textContent.split(",")[0].split("'")[1];
                    return source;
                });
                item.link = sourceLink;
            }
            return data;
        })
        .catch(err => console.error(err));

    Promise.all([p1, p2])
        .then(res => console.log(res))
        .then(res => bowser.close())
        .catch(err => console.error(err));
})();
