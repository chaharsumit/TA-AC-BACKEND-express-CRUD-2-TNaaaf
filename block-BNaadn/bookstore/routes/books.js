let express = require('express');
const Author = require('../models/author');
let Book = require('../models/book');
let Category = require('../models/category');

let router = express.Router();

router.get('/', (req, res) => {
  res.render('books');
})

router.get('/new', (req, res) => {
  res.render('createBook');
})

router.post('/', (req,res,next) => {
  Book.create(req.body, (err, newBook) => {
    if(err){
      return next(err);
    }
    let bookId = newBook.id;
    req.body.bookId = bookId;
    Author.findOne({ name: req.body.name }, (err, author) => {
      if(author){
        Author.findOneAndUpdate({ name: req.body.name }, {$push: {bookId: req.body.bookId}}, (err, author) => {
          if(err){
            return next(err);
          }
          req.body.authorId = author.id;
          Book.findByIdAndUpdate(bookId, req.body, (err, newBody) => {
            if(err){
              return next(err);
            }
            res.redirect('/');
          });
        });
      }else{
        Author.create(req.body, (err, newAuthor) => {
          if(err){
            return next(err);
          }
          req.body.authorId = newAuthor.id;
          Book.findByIdAndUpdate(bookId, req.body, (err, newBody) => {
            if(err){
              return next(err);
            }
            res.redirect('/');
          });
        })
      }
    })
  });
})

module.exports = router;