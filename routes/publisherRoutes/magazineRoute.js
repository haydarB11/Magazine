const express = require('express');

const router = express.Router();

const MagazineController = require('../../controllers/publisher/MagazineController');

const ArticleController = require('../../controllers/publisher/ArticleController');

const CommentController = require('../../controllers/publisher/CommentController');

const MagazineValidation = require('../../validation/MagazineValidation');

const ArticleValidation = require('../../validation/ArticleValidation');

// comments

router.get('/articles/:article_id/comments/', CommentController.getAllCommentsForOneArticle);

// articles

router.post('/articles/', ArticleValidation.createArticle, ArticleController.create);

router.put('/articles/:article_id', ArticleValidation.validateMagazineOwnership, ArticleValidation.updateArticle, ArticleController.create);

router.delete('/articles/', ArticleValidation.deleteArticles, ArticleController.deleteManyArticles);

router.get('/articles/:article_id', ArticleController.view);

router.get('/:magazine_id/articles', ArticleController.getAllArticlesForOneMagazine);

// magazines

router.post('/', MagazineValidation.createMagazine, MagazineController.create);

router.put('/:magazine_id', MagazineValidation.validateMagazineOwnership, MagazineValidation.updateMagazine, MagazineController.updateMagazine);

router.delete('/', MagazineValidation.deleteMagazines, MagazineController.deleteManyMagazines);

router.get('/', MagazineController.index);

router.get('/mine', MagazineController.getAllMyMagazines);

router.get('/:magazine_id', MagazineController.view);


module.exports = router;