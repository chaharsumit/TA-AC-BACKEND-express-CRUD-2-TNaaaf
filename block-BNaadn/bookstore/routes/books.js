let express = require('express');
const Author = require('../models/author');
let Book = require('../models/book');
let Category = require('../models/category');

let router = express.Router();

router.get('/', (req, res) => {
  Book.find({}, (err, books) => {
    if(err){
      return next(err);
    } 
    Category.find({}, (err, fetchedCategories) => {
      if(err){
        return next(err);
      }
      Author.find({}, (err, fetchedAuthors) => {
        res.render('books' , { books: books, fetchedCategories: fetchedCategories, fetchedAuthors: fetchedAuthors });
      })
    })
  });
})

router.get('/new', (req, res) => {
  res.render('createBook');
})

router.get('/:id', (req, res) => {
  Book.findById(req.params.id).populate('categoryId authorId').exec((err, book) => {
    if(err){
      return next(err);
    }
    res.render('booksDetails', { book: book });
  })
})

router.get('/categories/:id', (req, res) => {
  Category.findById(req.params.id).populate('bookId').exec((err, result) => {
    if(err){
      return next(err);
    }
    res.render('categories', { result: result });
  })
})

router.get('/authors/:id', (req, res) => {
  Author.findById(req.params.id).populate('bookId').exec((err, result) => {
    if(err){
      return next(err);
    }
    res.render('authors', { result: result });
  })
})

router.post('/', (req,res,next) => {
  Book.create(req.body, (err, newBook) => {
    if(err){
      return next(err);
    }
    let bookId = newBook.id;
    req.body.bookId = bookId;
    req.body.category = req.body.category.trim().split(' ');
    for(let i = 0 ; i < req.body.category.length ; i++){
      Category.findOneAndUpdate({categoryName: req.body.category[i]}, {$push: {bookId: req.body.bookId}}, (err, updatedCategory) => {
        if(err){
          return next(err);
        }
        Book.findByIdAndUpdate(bookId, {$push: {categoryId: updatedCategory.id}}, (err, updatedBook) => {
          if(err){
            return next(err);
          }
        })
      });
    }
    Author.findOne({ name: req.body.name }, (err, author) => {
      if(author){
        Author.findOneAndUpdate({ name: req.body.name }, {$push: {bookId: req.body.bookId}}, (err, author) => {
          if(err){
            return next(err);
          }
          req.body.authorId = author.id;
          Book.findByIdAndUpdate(bookId, req.body, (err, newBook) => {
            if(err){
              return next(err);
            }
            res.redirect('/books');
          });
        });
      }else{
        Author.create(req.body, (err, newAuthor) => {
          if(err){
            return next(err);
          }
          req.body.authorId = newAuthor.id;
          Book.findByIdAndUpdate(bookId, req.body, (err, newBook) => {
            if(err){
              return next(err);
            }
            res.redirect('/books');
          });
        })
      }
    })
  });
})

module.exports = router;