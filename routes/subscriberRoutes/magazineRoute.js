const express = require('express');

const router = express.Router();

const MagazineController = require('../../controllers/subscriber/MagazineController');

const ArticleController = require('../../controllers/subscriber/ArticleController');

const CommentController = require('../../controllers/subscriber/CommentController');

const MagazineValidation = require('../../validation/MagazineValidation');

const CommentValidation = require('../../validation/CommentValidation');

// comments

router.post('/articles/comments/', CommentValidation.addComment, CommentController.create);

router.delete('/articles/comments/:comment_id', CommentValidation.ownComment, CommentController.deleteMyComment);

router.get('/articles/:article_id/comments/', CommentController.getAllCommentsForOneArticle);

// articles

router.get('/articles/:article_id', ArticleController.view);

router.get('/:magazine_id/articles', MagazineValidation.validateMagazineSubscribe, ArticleController.getAllArticlesForOneMagazine);

// magazines

router.get('/', MagazineController.index);

router.get('/mine', MagazineController.getAllMyMagazines); // here without pending, just active magazines

router.get('/suggestions/:magazine_id', MagazineController.getSuggestionMagazinesNotSubscribeInYet);

router.get('/publishers/:publisher_id', MagazineController.getAllMyMagazinesForOnePublisher);

router.get('/:magazine_id',MagazineValidation.validateMagazineSubscribe, MagazineController.view);


module.exports = router;