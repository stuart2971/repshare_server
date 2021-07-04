var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Haul = new Schema({
    name: String,
    listings: [
        {
            link: String,
            price: String,
            imageURL: [String],
            rating: String,
            tag: String,
            itemName: String,
        },
    ],
});

module.exports = mongoose.model("Haul", Haul);
