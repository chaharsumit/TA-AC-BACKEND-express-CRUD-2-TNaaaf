let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  pages: Number,
  publication: String,
  cover_image: String,
  authorId: { type: Schema.Types.ObjectId, ref: "Author" },
  categoryId: [{ type: Schema.Types.ObjectId, ref: "Category" }]
}, { timestamps: true });

let Book = mongoose.model("Book", bookSchema);

module.exports = Book;