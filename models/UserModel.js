var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const User = new Schema({
    auth0ID: String,
    currency: String,
    hauls: [
        {
            name: String,
        },
    ],
});

module.exports = mongoose.model("User", User);
