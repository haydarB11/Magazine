const { Sequelize, Comment, User } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;

class CommentService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Comment>|null}
     */
    async findModel(id) {
        const comment = await Comment.findOne({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            where: {
                id: id
            }
        });
        return comment;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Comment>}
     */
    async create(body) {
        const comment = await Comment.create(body);
        return comment;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Comment>}
     */
    async update(body, id) {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Comment" }));
        }
        comment.comment = body.comment || comment.comment;
        await comment.save();
        return comment;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Comment>}
     */
    async toggleVisibility(id) {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Comment" }));
        }
        comment.is_visible = !comment.is_visible;
        await comment.save();
        return comment;
    };

    /**
     * 
     * @param {number} article_id 
     * @returns {Promise<Comment[]>}
     */
    async findCommentsForOneArticle(article_id) {
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            where: {
                article_id: article_id
            }
        });
        return comments;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Comment>}
     */
    async deleteComment(id, user_id) {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Comment" }));
        }
        if (comment.user_id !== user_id) {
            throw new NotFoundError(i18next.t("validation.unauthorized_access", { field: "Comment" }));
        }
        await comment.destroy();
        return comment;
    };

    /**
     * 
     * @param {number[]} ids
     * @returns {Promise<Comment[]>}
     */
    async deleteComments(ids) {
        const comments = await Comment.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        await Comment.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return comments;
    };
}
module.exports = new CommentService();