const { Article, User, Comment, Sequelize } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;

class ArticleService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Article>|null}
     */
    async findModel(id) {
        const article = await Article.findOne({
            include: [
                {
                    required: false,
                    model: Comment,
                    as: 'comments',
                    where: {
                        is_visible: true
                    },
                    include: [
                        {
                            model: User,
                            as: 'user'
                        }
                    ]
                }
            ],
            where: {
                id: id
            }
        });
        return article;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Article>}
     */
    async create(body) {
        const article = await Article.create(body);
        return article;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Article>}
     */
    async update(body, id) {
        const article = await Article.findByPk(id);
        if (!article) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Article" }));
        }
        article.title = body.title || article.title;
        article.content = body.content || article.content;
        await article.save();
        return article;
    };

    /**
     * 
     * @param {number} magazine_id 
     * @returns {Promise<Article[]>}
     */
    async findArticlesForOneMagazine(magazine_id) {
        const articles = await Article.findAll({
            include: [
                {
                    required: true,
                    model: Comment,
                    as: 'comments',
                    where: {
                        is_visible: true
                    },
                    include: [
                        {
                            model: User,
                            as: 'user',
                        }
                    ]
                }
            ],
            where: {
                magazine_id: magazine_id
            }
        });
        return articles;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Article>}
     */
    async deleteArticle(id) {
        const article = await Article.findByPk(id);
        if (!article) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Article" }));
        }
        await article.destroy();
        return article;
    };

    /**
     * 
     * @param {number[]} ids
     * @returns {Promise<Article[]>}
     */
    async deleteArticles(ids) {
        const articles = await Article.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        await Article.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return articles;
    };

}

module.exports = new ArticleService();