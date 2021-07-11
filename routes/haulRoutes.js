const express = require("express");
const router = express.Router();

const {
    getHaulNames,
    createHaul,
    deleteHaul,
    createListing,
    getListings,
    deleteListing,
    updateListing,
} = require("../utils/haulUtils");

const { scrapeImgur, scrape } = require("../utils/webscrape");

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
    res.json({ deleted });
});

// Currently there is no limit for the number of listings returned because most mega lists are in the 100-200 range and dont need a limit.
router.get("/getListings/:haulID", async (req, res) => {
    const listings = await getListings(req.params.haulID);
    res.json(listings);
});
router.post("/createListing/:haulID", async (req, res) => {
    let listing = req.body;

    try {
        const scrapedData = await scrape(req.body.link);
        if (scrapedData.itemName && !listing.itemName)
            listing.itemName = scrapedData.itemName;
        if (scrapedData.price) listing.price = scrapedData.price;
        else listing.price = "";

        if (listing.imageURL) {
            if (listing.imageURL.includes("imgur")) {
                const images = await scrapeImgur(listing.imageURL);
                listing.imageURL = images.imageURL;
            }
        } else {
            listing.imageURL = scrapedData.imageURL;
        }
    } catch (err) {
        console.log("ERROR SCRAPING: ", err);
    }

    const insertedListing = await createListing(req.params.haulID, listing);
    res.json(insertedListing);
});

router.get("/deleteListing/:haulID/:listingID", async (req, res) => {
    const deleted = await deleteListing(
        req.params.haulID,
        req.params.listingID
    );
    res.json({ deleted });
});

router.post("/updateListing/:listingID", async (req, res) => {
    const updated = await updateListing(req.params.listingID, req.body);
    res.json({ updated });
});

router.get("/test", async (req, res) => {
    const link =
        "https://m.intl.taobao.com/detail/detail.html?id=646954610226&spm=1101.1101.N.N.5dab637";
    scrape(link).then((d) => {
        res.json(d);
    });
});
module.exports = router;
