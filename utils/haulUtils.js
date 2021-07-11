const UserModel = require("../models/UserModel");
const HaulModel = require("../models/HaulModel");

const { addHaulToUser } = require("./userUtils");

// Returns the hauls from UserModel
async function getHaulNames(auth0ID) {
    const user = await UserModel.findOne({ auth0ID }, "hauls");
    return user;
}

// Returns the haul that was inserted into UserModel
async function createHaul(auth0ID, haulName) {
    let haul = new HaulModel({
        name: haulName,
        listings: [],
    });

    return new Promise((resolve) => {
        haul.save(async (err, doc) => {
            await addHaulToUser(auth0ID, doc._id, haulName);
            resolve({ _id: doc._id, name: haulName });
        });
    });
}

// Deletes a haul from UserModel and HaulModel
async function deleteHaul(auth0ID, haulID) {
    await UserModel.updateOne(
        { auth0ID },
        { $pull: { hauls: { _id: haulID } } }
    );
    await HaulModel.findByIdAndDelete(haulID);
    return true;
}

// Returns the newly inserted listing (May be slow since it is also fetching the entire doc when it saves the listing)
async function createListing(haulID, listing) {
    const haul = await HaulModel.findOne({ _id: haulID });
    haul.listings.push(listing);

    return new Promise((resolve) => {
        haul.save((err, doc) => {
            const listings = doc.listings;
            resolve(listings[listings.length - 1]);
        });
    });
}

// Returns ALL the listings of a haul.
// NOTE: This might be bad once hauls get large but this will be fine for now
async function getListings(haulID) {
    const listings = await HaulModel.findOne(
        {
            _id: haulID,
        },
        "listings"
    );
    return listings;
}

async function deleteListing(haulID, listingID) {
    const listing = await HaulModel.updateOne(
        { _id: haulID },
        {
            $pull: { listings: { _id: listingID } },
        }
    );
}

async function updateListing(listingID, newListing) {
    const listing = await HaulModel.updateOne(
        { "listings._id": listingID },
        {
            $set: {
                "listings.$.link": newListing.link,
                "listings.$.itemName": newListing.itemName,
                "listings.$.rating": newListing.rating,
                "listings.$.tag": newListing.tag,
                "listings.$.price": newListing.price,
                "listings.$.imageURL": newListing.imageURL,
            },
        }
    );
    return listing;
}
module.exports = {
    getHaulNames,
    createHaul,
    deleteHaul,
    createListing,
    getListings,
    deleteListing,
    updateListing,
};
