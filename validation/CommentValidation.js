const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError, NotFoundError, ForbiddenError } = require('../util/customError');
const CommentService = require('../services/CommentService');

class CommentValidation {
    static addComment = async (req, res, next) => {
        const Schema = Joi.object({
            comment: Joi.string()
                .min(2)
                .max(2000)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Text" }),
                    'string.min': i18next.t('validation.min_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.max': i18next.t('validation.max_message', { field: "Text", limit: '{{#limit}}' }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Text" }),
                    'any.required': i18next.t('validation.required_message', { field: "Text" }),
                }),
        });
        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static ownComment = async (req, res, next) => {
        const { comment_id } = req.params;        

        const idSchema = Joi.number().integer().positive().required();
        const { error } = idSchema.validate(comment_id);
        if (error) {
            return next(new ValidationError(i18next.t('validation.invalid_id_message', { field: "Comment ID" })));
        }

        try {
            const comment = await CommentService.findModel(comment_id);
            if (!comment) {
                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Comment" }));
            }

            if (comment.user_id !== req.user.id && req.user.role !== 1) {
                throw new ForbiddenError(i18next.t("error.access_forbidden", { field: "Comment" }));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CommentValidation;


