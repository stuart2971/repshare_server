const UserModel = require("../models/UserModel");

async function addUser(auth0ID) {
    const user = new UserModel({
        auth0ID,
        currency: "yuan",
        hauls: [],
    });
    return new Promise((resolve) => {
        user.save((err, doc) => {
            if (err) console.log(err);
            resolve(doc);
        });
    });
}
async function getUser(auth0ID) {
    const user = UserModel.findOne({ auth0ID }, "auth0ID currency");
    return user;
}

async function addHaulToUser(auth0ID, haulID, haulName) {
    await UserModel.updateOne(
        { auth0ID },
        {
            $push: { hauls: { _id: haulID, name: haulName } },
        }
    );
}

async function changeCurrency(auth0ID, currency) {
    try {
        await UserModel.updateOne({ auth0ID }, { currency });
        return true;
    } catch (err) {
        console.log("ERR CHANGING CURRENCY", err);
        return err;
    }
}

module.exports = {
    addUser,
    getUser,
    addHaulToUser,
    changeCurrency,
};
