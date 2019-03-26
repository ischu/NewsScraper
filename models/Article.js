const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // comment object stores Comment id, linking to Comment model
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// create mongoose model and export
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;