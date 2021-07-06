const puppeteer = require("puppeteer");

async function scrapeTaobao(link) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    await page.goto(link, { waitUntil: "networkidle2" });

    let data = await page.evaluate(() => {
        let imageURL = document.getElementById("J_ImgBooth");
        if (imageURL) imageURL = [imageURL.src];

        let videoURL = document.querySelector("video[class='lib-video']");
        if (videoURL) videoURL = videoURL.src;

        let price = document.querySelector("em[class='tb-rmb-num']");
        if (price) price = price.innerText;

        let itemName = document.getElementById("J_Title");
        if (itemName) itemName = itemName.innerText;

        return {
            imageURL,
            price,
            itemName,
        };
    });
    await browser.close();
    return data;
}
async function scrapeWeidian(link) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    await page.goto(link, { waitUntil: "networkidle2" });

    let data = await page.evaluate(() => {
        let imageURL = document.querySelector("img[class='item-img']");
        if (imageURL) imageURL = [imageURL.src];

        let videoURL = document.getElementById("video");
        if (videoURL) videoURL = videoURL.src;

        let priceSpan =
            document.querySelector("span[class='discount-cur']") ||
            document.querySelector("span[class='cur-price']");
        let price = "";
        if (priceSpan) price = priceSpan.innerText;

        let itemName = document.querySelector("div[class='item-title']");
        if (itemName) itemName = itemName.innerText;

        return {
            imageURL,
            videoURL,
            price,
            itemName,
        };
    });
    await browser.close();
    return data;
}
async function scrapeImgur(link) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    await page.goto(link, { waitUntil: "networkidle2" });

    let data = await page.evaluate(() => {
        let imageTags = document.getElementsByClassName("image-placeholder");
        let imageURL = [];
        if (imageTags) {
            for (let i = 0; i < imageTags.length; i++) {
                imageURL.push(imageTags[i].src);
            }
        }

        return {
            imageURL,
        };
    });
    await browser.close();
    return data;
}

async function scrape(link) {
    if (link.includes("taobao")) return scrapeTaobao(link);
    if (link.includes("weidian")) return scrapeWeidian(link);
}

module.exports = { scrapeTaobao, scrapeWeidian, scrapeImgur, scrape };
