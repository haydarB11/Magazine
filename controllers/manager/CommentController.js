const CommentService = require('../../services/CommentService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class CommentController {

    toggleVisibility = async (req, res, next) => {
        const { comment_id } = req.params;
        try {
            const comment = await CommentService.toggleVisibility(comment_id);
            return JsonResponse.success(res, comment, i18next.t("update_message", { field: "Comment" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { comment_id } = req.params;
        try {
            const comment = await CommentService.findModel(comment_id);
            return JsonResponse.success(res, comment);
        } catch (error) {
            next(error)
        }
    };

    getAllCommentsForOneArticle = async (req, res, next) => {
        const { article_id } = req.params;
        try {
            const comments = await CommentService.findCommentsForOneArticle(article_id);
            return JsonResponse.success(res, comments);
        } catch (error) {
            next(error)
        }
    };

    deleteComments = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const comments = await CommentService.deleteComments(ids);
            return JsonResponse.success(res, comments, i18next.t("delete_message", { field: "Comment" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new CommentController();