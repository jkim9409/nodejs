const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: String,
    author: String,
    commentBody: String,
    date: Date
});
CommentSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
  });
  CommentSchema.set("toJSON", {
    virtuals: true,
  });

  
module.exports = mongoose.model("Comment",CommentSchema);