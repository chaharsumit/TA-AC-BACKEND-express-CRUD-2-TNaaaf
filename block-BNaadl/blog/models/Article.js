let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  author: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;