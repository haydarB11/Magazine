const { User, Magazine, Article, Subscription, Sequelize, Comment, Collection } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;

class MagazineService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Magazine>|null}
     */
    async findModel(id) {
        const magazine = await Magazine.findOne({
            include: [
                {
                    required: false,
                    model: Article,
                    as: 'articles',
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
                                    as: 'user',
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                id: id
            }
        });
        return magazine;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Magazine>}
     */
    async create(body) {
        const magazine = await Magazine.create(body);
        return magazine;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Magazine>}
     */
    async update(body, id) {
        const magazine = await Magazine.findByPk(id);
        if (!magazine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
        }
        magazine.name = body.name || magazine.name;
        magazine.description = body.description || magazine.description;
        magazine.date = body.date || magazine.date;
        await magazine.save();
        return magazine;
    };

    /**
     * 
     * @param {number} publisher_id 
     * @returns {Promise<Magazine>}
     */
    async findMagazinesForOnePublisher(publisher_id, includeArticles = true) {

        const magazines = await Magazine.findAll({
            include: includeArticles ? 
                [
                    {
                        model: Article,
                        as: 'articles',
                        include: [
                            {
                                model: Comment,
                                as: 'comments',
                                where: {
                                    is_visible: true
                                }
                            }
                        ]
                    }
                ] : [],
            where: {
                user_id: publisher_id
            }
        });

        return magazines;
    }

    /**
     * 
     * @param {number} collection_id 
     * @returns {Promise<Magazine>}
     */
    async findMagazinesForOneCollection(collection_id, includeArticles = true) {

        const magazines = await Magazine.findAll({
            include: includeArticles ? 
                [
                    {
                        model: Article,
                        as: 'articles',
                        include: [
                            {
                                model: Comment,
                                as: 'comments',
                                include: [
                                    {
                                        model: User,
                                        as: 'user',
                                    }
                                ],
                                where: {
                                    is_visible: true
                                }
                            }
                        ]
                    },
                    {
                        model: Collection,
                        as: 'collections',
                        through: { attributes: [] },
                        where: {
                            id: collection_id
                        }
                    }
                ] : [],
        });

        return magazines;
    }

    /**
     * @returns {Promise<Magazine[]>}
     */
    async findMagazines() {
        const magazines = await Magazine.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                },
            ]
        });
        return magazines;
    };

    /**
     * @param {number} magazine_id
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise<Magazine[], totalItems: number, totalPages: number, currentPage: number>}
     */
    async findRelatedMagazinesPagination(magazine_id, limit= 5, offset= 0) {
        const magazine = await Magazine.findByPk(magazine_id, {
            include: [{ model: Collection, as: 'collections', through: { attributes: [] } }],
        });

        if (!magazine || magazine.collections.length === 0) {
            throw new NotFoundError(i18next.t('validation.not_found', { field: "Magazine or Collection" }));
        }

        const collection_id = magazine.collections[0].id;

        const totalItems = await Magazine.count({
            include: [
                {
                    model: Collection,
                    as: 'collections',
                    where: { id: collection_id },
                    through: { attributes: [] },
                },
            ],
            where: { id: { [Op.ne]: magazine_id } },
        });
    
        const totalPages = Math.ceil(totalItems / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        const magazines = await Magazine.findAll({
            include: [
                {
                    model: Collection,
                    as: 'collections',
                    where: { id: collection_id },
                    through: { attributes: [] },
                },
            ],
            where: { id: { [Op.ne]: magazine_id } },
            limit: +limit,
            offset: +offset,
        });

        return {
            magazines,
            totalItems,
            totalPages,
            currentPage,
        };
    }

    /**
     * 
     * @param {number} subscriber_id 
     * @returns {Promise<Magazine[]>}
     */
    async findMagazinesForOneSubscriber(subscriber_id) {
        const today = new Date();
        const magazines = await Magazine.findAll({
            include: [
                {
                    model: Article,
                    as: 'articles'
                },
                {
                    attributes: [],
                    required: true,
                    model: Subscription,
                    as: 'subscriptions',
                    where: {
                        user_id: subscriber_id,
                        starting_date: {
                            [Op.lte]: today 
                        },
                        ending_date: {
                            [Op.gt]: today 
                        }
                    }
                }
            ]
        });
        return magazines;
    };

    /**
     * 
     * @param {number} article_id 
     * @returns {Promise<Magazine[]>}
     */
    async findModelDependingOneArticleId(article_id) {
        const magazine = await Magazine.findOne({
            include: [
                {
                    attributes: [],
                    required: true,
                    model: Article,
                    as: 'articles',
                    where: {
                        id: article_id
                    }
                }
            ]
        });
        return magazine;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Magazine>}
     */
    async deleteMagazine(id) {
        const Magazine = await Magazine.findByPk(id);
        if (!Magazine) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
        }
        await Magazine.destroy();
        return Magazine;
    };

    /**
     * 
     * @param {number[]} ids
     * @returns {Promise<Magazine[]>}
     */
    async deleteMagazines(ids) {
        const magazines = await Magazine.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        await Magazine.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return magazines;
    };

}

module.exports = new MagazineService();