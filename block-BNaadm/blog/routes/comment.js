var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Comment = require('../models/comments');

router.get('/:id/like', (req, res) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: { likes: 1 }},(err, editedComment) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + editedComment.articleId);
  });
});

router.get('/:id/dislike', (req, res) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: { likes: -1 }},(err, editedComment) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + editedComment.articleId);
  });
});

router.get('/:id/delete', (req, res) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if(err){
      return next(err);
    }
    Article.findByIdAndUpdate(deletedComment.articleId, { $pull: { comments: deletedComment._id }}, (err, updatedArticle) => {
      res.redirect('/articles/' + deletedComment.articleId);
    })
  })
})

router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if(err){
      return next(err);
    }
    res.render('editComment', { comment: comment });
  })
})

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + updatedComment.articleId);
  });
})

module.exports = router;