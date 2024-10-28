const ArticleService = require('../../services/ArticleService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class ArticleController {

    view = async (req, res, next) => {
        const { article_id } = req.params;
        try {
            const article = await ArticleService.findModel(article_id);
            return JsonResponse.success(res, article);
        } catch (error) {
            next(error)
        }
    };

    getAllArticlesForOneMagazine = async (req, res, next) => {
        const { magazine_id } = req.params;
        try {
            const articles = await ArticleService.findArticlesForOneMagazine(magazine_id);
            return JsonResponse.success(res, articles);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new ArticleController();