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

    res.json(insertedHaul);
});
router.get("/deleteHaul/:auth0ID/:haulID", async (req, res) => {
    const deleted = await deleteHaul(req.params.auth0ID, req.params.haulID);
    res.json(deleted);
});

router.post("/createListing/:auth0ID/:haulID", async (req, res) => {
    let listing = req.body;
    listing.dateAdded = new Date();
    if (!listing.pricing) listing.price = "Unable to find price";
    createListing(req.params.auth0ID, req.params.haulID, listing);
});

router.get("/getListings/:auth0ID/:haulID", async (req, res) => {
    const listings = await getListings(req.params.auth0ID, req.params.haulID);
    res.json(listings);
});
module.exports = router;
