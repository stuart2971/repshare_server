const UserModel = require("../models/UserModel");

async function getHaulNames(auth0ID) {
    const user = await UserModel.findOne(
        { auth0ID },
        "hauls.haulName hauls._id"
    );
    return user;
}

async function createHaul(auth0ID, haulName) {
    let haul = {
        haulName,
        dateCreated: new Date(),
        listings: [],
    };
    const insertedHaul = await UserModel.updateOne(
        { auth0ID },
        {
            $push: { hauls: haul },
        }
    );
    // After user inserts a haul, returns all the haul names and id
    return getHaulNames(auth0ID);
}

async function deleteHaul(auth0ID, haulID) {
    const result = await UserModel.updateOne(
        { auth0ID },
        { $pull: { hauls: { _id: haulID } } }
    );
    if (result.nModified === 0) return { deleted: false };
    return { deleted: true };
}

async function createListing(auth0ID, haulID, listing) {
    const insertedHaul = await UserModel.updateOne(
        { auth0ID, "hauls._id": haulID },
        {
            $push: { "hauls.$.listings": listing },
        }
    );
    // After user inserts a haul, returns all the haul names and id
    return getHaulNames(auth0ID);
}

async function getListings(auth0ID, haulID) {
    const listings = await UserModel.findOne(
        { auth0ID, "hauls._id": haulID },
        "hauls.$"
    );
    return listings;
}

module.exports = {
    getHaulNames,
    createHaul,
    deleteHaul,
    createListing,
    getListings,
};
