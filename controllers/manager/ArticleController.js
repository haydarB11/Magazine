const ArticleService = require('../../services/ArticleService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class ArticleController {

    create = async (req, res, next) => {
        const body = req.body;
        try {
            const article = await ArticleService.create(body);
            return JsonResponse.success(res, article, i18next.t("create_message", { field: "Article" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

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

    updateArticle = async (req, res, next) => {
        const { article_id } = req.params;
        const body = req.body;
        try {
            const article = await ArticleService.update(body, article_id);
            return JsonResponse.success(res, article, i18next.t("update_message", { field: "Article" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    deleteManyArticles = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const articles = await ArticleService.deleteArticles(ids);
            return JsonResponse.success(res, articles, i18next.t("delete_message", { field: "Article" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new ArticleController();