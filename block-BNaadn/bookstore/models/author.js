let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let authorSchema = new Schema({
  name: String,
  email: String,
  country: String,
  bookId: [{ type: Schema.Types.ObjectId, ref: "Book" }]
});

let Author = mongoose.model("Author", authorSchema);

module.exports = Author;