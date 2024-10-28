const CommentService = require('../../services/CommentService');
const JsonResponse = require('../../util/JsonResponse');

class CommentController {

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
}

module.exports = new CommentController();