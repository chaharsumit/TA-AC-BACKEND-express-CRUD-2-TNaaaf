var express = require('express');
var router = express.Router();
var Article = require('../models/Article');

/* GET users listing. */
router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err){
      return next(err);
    }
    res.render('articles', { articles: articles });
  });
});

module.exports = router;
