const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: String,
    author: String,
    postBody: String,
    date: Date
});

PostSchema.virtual("postId").get(function () {
    return this._id.toHexString();
  });
  PostSchema.set("toJSON", {
    virtuals: true,
  });


module.exports = mongoose.model("Post",PostSchema);