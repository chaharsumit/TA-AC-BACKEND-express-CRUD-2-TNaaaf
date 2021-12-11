let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
  categoryName: String,
  bookId: [{ type: Schema.Types.ObjectId, ref: "Book" }]
}, { timestamps: true });

let Category = mongoose.model("Category", categorySchema);

// initializing the category collection on starting the server fist time

Category.countDocuments({ bookId: {$exists: true} }, (err, count) => {
  if(count === 0){
    Category.create({categoryName: "Fiction"}, {categoryName: "Adventure"}, {categoryName: "Motivation"}, {categoryName: "Technology"});
  }
})

module.exports = Category;