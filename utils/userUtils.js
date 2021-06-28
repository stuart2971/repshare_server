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
    const user = UserModel.findOne({ auth0ID });
    return user;
}

module.exports = {
    addUser,
    getUser,
};
