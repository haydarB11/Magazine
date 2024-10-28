const express = require('express');

const router = express.Router();

const MagazineController = require('../../controllers/manager/MagazineController');

const ArticleController = require('../../controllers/manager/ArticleController');

const CommentController = require('../../controllers/manager/CommentController');

const MagazineValidation = require('../../validation/MagazineValidation');

const ArticleValidation = require('../../validation/ArticleValidation');

// comments

router.patch('/articles/comments/:comment_id', CommentController.toggleVisibility);

router.delete('/articles/comments/', CommentController.deleteComments);

router.get('/articles/:article_id/comments/', CommentController.getAllCommentsForOneArticle);

// articles

router.post('/articles/', ArticleValidation.createArticle, ArticleController.create);

router.put('/articles/:article_id', ArticleValidation.updateArticle, ArticleController.create);

router.delete('/articles/', ArticleValidation.deleteArticles, ArticleController.deleteManyArticles);

router.get('/articles/:article_id', ArticleController.view);

router.get('/:magazine_id/articles', ArticleController.getAllArticlesForOneMagazine);

// magazines

router.post('/', MagazineValidation.createMagazine, MagazineController.create);

router.put('/:magazine_id', MagazineValidation.updateMagazine, MagazineController.updateMagazine);

router.delete('/', MagazineController.deleteManyMagazines);

router.get('/', MagazineController.index);

router.get('/collections/:collection_id', MagazineController.findMagazinesForOneCollection);

router.get('/publishers/:publisher_id', MagazineController.findMagazinesForOnePublisher);

router.get('/:magazine_id', MagazineController.view);


module.exports = router;