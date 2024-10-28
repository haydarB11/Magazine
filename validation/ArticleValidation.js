const ArticleService = require("../services/ArticleService");
const MagazineService = require("../services/MagazineService");
const { NotFoundError, ValidationError, ForbiddenError } = require("../util/customError");
const Joi = require('joi');
const i18next = require("../util/i18n/config");

class ArticleValidation {

    static createArticle = async (req, res, next) => {
        const Schema = Joi.object({
            title: Joi.string()
                .min(1)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Title" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Title" }),
                    'any.required': i18next.t('validation.required_message', { field: "Title" }),
                }),
            content: Joi.string()
                .min(1)
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Content" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Content" }),
                }),
            magazine_id: Joi.number()
                .integer()
                .positive()
                .required()
                .custom(async (value, helpers) => {
                    const magazine = await MagazineService.findModel(value);
                    if (!magazine) {
                        throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
                    }
                    if (magazine.user_id !== req.user.id && req.user.role !== 1) {
                        throw new ForbiddenError(i18next.t("validation.ownership_message", { field: "Magazine" }));
                    }
                    return value;
                })
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Magazine ID" }),
                    'number.integer': i18next.t('validation.integer_message', { field: "Magazine ID" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Magazine ID" }),
                    'any.required': i18next.t('validation.required_message', { field: "Magazine ID" }),
                })
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static updateArticle = async (req, res, next) => {        
        const Schema = Joi.object({
            title: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Title" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Title" }),
                }),
            content: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Content" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Content" }),
                })
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static deleteArticles = async (req, res, next) => {
        const Schema = Joi.object({
            ids: Joi.array()
                .items(
                    Joi.number()
                        .integer()
                        .positive()
                        .required()
                        .custom(async (value, helpers) => {
                            const article = await ArticleService.findModel(value);
                            console.log(article);
                            
                            if (!article) {
                                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Article" }));
                            }
                            const magazine = await MagazineService.findModel(article.magazine_id);
                            if (magazine.user_id !== req.user.id && req.user.role !== 1) {
                                throw new ForbiddenError(i18next.t("validation.ownership_message", { field: "Article" }));
                            }
                            return value;
                        })
                        .messages({
                            'number.base': i18next.t('validation.number_message', { field: "Article ID" }),
                            'number.integer': i18next.t('validation.integer_message', { field: "Article ID" }),
                            'number.positive': i18next.t('validation.positive_message', { field: "Article ID" }),
                            'any.required': i18next.t('validation.required_message', { field: "Article ID" }),
                        })
                )
                .min(1)
                .required()
                .messages({
                    'array.base': i18next.t('validation.array_message', { field: "Article IDs" }),
                    'array.min': i18next.t('validation.min_array_message', { field: "Article IDs" }),
                    'any.required': i18next.t('validation.required_message', { field: "Article IDs" }),
                })
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static validateMagazineOwnership = async (req, res, next) => {
        const { article_id } = req.params;        

        const idSchema = Joi.number().integer().positive().required();
        const { error } = idSchema.validate(article_id);
        if (error) {
            return next(new ValidationError(i18next.t('validation.invalid_id_message', { field: "Magazine ID" })));
        }

        try {
            const magazine = await MagazineService.findModelDependingOneArticleId(article_id);
            if (!magazine) {
                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
            }

            if (magazine.user_id !== req.user.id && req.user.role !== 1) {
                throw new ForbiddenError(i18next.t("validation.ownership_message", { field: "Magazine" })); // here add a message
            }

            next();
        } catch (error) {
            next(error);
        }
    };

}

module.exports = ArticleValidation;