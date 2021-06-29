const express = require("express");
const router = express.Router();

const {
    getHaulNames,
    createHaul,
    deleteHaul,
    createListing,
    getListings,
} = require("../utils/haulUtils");

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
    // Do some webscraping here for the price & image
    if (!listing.pricing) listing.price = "Unable to find price";
    const insertedListing = await createListing(req.params.haulID, listing);
    res.json(insertedListing);
});

router.get("/getListings/:haulID", async (req, res) => {
    const listings = await getListings(req.params.haulID);
    res.json(listings);
});
module.exports = router;
