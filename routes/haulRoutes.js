const express = require("express");
const router = express.Router();

const {
    getHaulNames,
    createHaul,
    deleteHaul,
    createListing,
    getListings,
} = require("../utils/haulUtils");

const {
    scrapeWeidian,
    scrapeTaobao,
    scrapeImgur,
    scrape,
} = require("../utils/webscrape");

router.get("/getHaulNames/:auth0ID", async (req, res) => {
    res.json(await getHaulNames(req.params.auth0ID));
});

router.get("/createHaul/:auth0ID/:haulName", async (req, res) => {
    const insertedHaul = await createHaul(
        req.params.auth0ID,
        req.params.haulName
    );
    console.log(insertedHaul);
    res.json(insertedHaul);
});
router.get("/deleteHaul/:auth0ID/:haulID", async (req, res) => {
    const deleted = await deleteHaul(req.params.auth0ID, req.params.haulID);
    res.json(deleted);
});

router.post("/createListing/:haulID", async (req, res) => {
    let listing = req.body;
    const scrapedData = await scrape(req.body.link);
    if (scrapedData.itemName && !listing.itemName)
        listing.itemName = scrapedData.itemName;
    if (scrapedData.price) listing.price = scrapedData.price;
    else listing.price = "Unable to find price";

    if (scrapedData.imageURL) {
        if (scrapedData.imageURL.length > 0) {
            listing.imageURL = scrapedData.imageURL[0];
        }
    }

    const insertedListing = await createListing(req.params.haulID, listing);
    res.json(insertedListing);
});

router.get("/getListings/:haulID", async (req, res) => {
    const listings = await getListings(req.params.haulID);
    res.json(listings);
});

router.get("/test", async (req, res) => {
    const link =
        "https://shop908919004.v.weidian.com/item.html?itemID=2756092539&spider_token=8179";
    scrape(link).then((d) => {
        res.json(d);
    });
});
module.exports = router;
