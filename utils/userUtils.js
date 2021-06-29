const UserModel = require("../models/UserModel");

async function addUser(auth0ID) {
    const user = new UserModel({
        auth0ID,
        hauls: [],
    });
    user.save((err) => {
        if (err) console.log(err);
        return true;
    });
}
async function getUser(auth0ID) {
    const user = UserModel.findOne({ auth0ID }, "auth0ID");
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

module.exports = {
    addUser,
    getUser,
    addHaulToUser,
};
