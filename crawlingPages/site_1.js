const site_1 = async page => {
    return new Promise(async (resolve, reject) => {
        const data = await page.evaluate(() => {
            let lists = [];
            const items = document.querySelectorAll(".container .col-md-8 a");
            for (let item of items) {
                let data = {};
                data.head = item.children[0].children[1].children[0].innerText;
                data.updateTime = item.children[0].children[1].children[1].innerText;
                data.link = item.getAttribute("href");
                lists.push(data);
            }
            return lists;
        });

        for (let item of data) {
            await page.goto(item.link, { waitUntil: "networkidle2" });
            const phpLink = await page.$$eval(
                "iframe",
                iframes => iframes.filter(iframe => iframe.src.endsWith(".php"))[0].src
            );
            await page.goto(phpLink, { waitUntil: "networkidle2" });
            const sourceLink = await page.$eval(
                "body script",
                el =>
                    el.innerText
                        .trim()
                        .split('source: "')[1]
                        .split('",')[0]
            );
            item.link = sourceLink;
        }
        resolve(data);
    }).catch(err => console.error(err));
};

module.exports = site_1;
