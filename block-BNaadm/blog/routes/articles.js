var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Comment = require('../models/comments');

/* GET users listing. */
router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err){
      return next(err);
    }
    res.render('articles', { articles: articles });
  });
});

router.get('/new', (req, res, next) => {
  res.render('createArticle');
});

router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(' ');
  Article.create(req.body, (err, createdUser) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles');
  });
}) 

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id).populate('comments').exec((err, article) => {
    if(err){
      return next(err);
    }
    res.render('articlesInfo', { article: article });
  });
});

router.get('/:id/delete', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles');
  });
});

router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if(err){
      return next(err);
    }
    res.render('editArticle', { article: article });
  })
});

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  req.body.tags = req.body.tags.trim().split(' ');
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + id);
  })
});

router.get('/:id/likes/inc', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, updatedArticle) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + id);
  })
})

router.get('/:id/likes/dec', (req, res) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, updatedArticle) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + id);
  })
})

router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, createdComment) => {
    if(err){
      return next(err);
    }
    Article.findByIdAndUpdate(id, { $push: { comments: createdComment._id }}, (err, updatedBook) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles/' + id);
    })
  });
});

module.exports = router;