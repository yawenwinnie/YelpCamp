var mongoose = require("mongoose");

//define a pattern for the documents
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
    comments: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
});


module.exports = mongoose.model('Campground', campgroundSchema);
