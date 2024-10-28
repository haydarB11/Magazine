const CommentService = require('../../services/CommentService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class CommentController {

    create = async (req, res, next) => {
        const body = req.body;
        body.user_id = req.user.id;
        body.date = new Date();
        try {
            const comment = await CommentService.create(body);
            return JsonResponse.success(res, comment, i18next.t("create_message", { field: "Comment" }), HttpConstant.CREATE);
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

    deleteMyComment = async (req, res, next) => {
        const { comment_id } = req.params;
        const user_id = req.user.id;
        try {
            const comments = await CommentService.deleteComment(comment_id, user_id);
            return JsonResponse.success(res, comments, i18next.t("delete_message", { field: "Comment" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new CommentController();