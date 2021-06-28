var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const User = new Schema({
    auth0ID: String,
    hauls: [
        {
            haulName: String,
            dateCreated: Date,
            listings: [
                {
                    link: String,
                    price: String,
                    imageURL: String,
                    rating: String,
                    tag: String,
                    itemName: String,
                    dateAdded: Date,
                },
            ],
        },
    ],
});

module.exports = mongoose.model("User", User);
