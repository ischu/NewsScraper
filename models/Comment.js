const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// This object is used for commenting on articles
const CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// create and export mongoose model
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;