const { ValidationError } = require("../util/customError");
const Joi = require('joi');
const i18next = require("../util/i18n/config");

class CollectionValidation {

    static createCollection = async (req, res, next) => {
        const Schema = Joi.object({
            title: Joi.string()
                .min(1)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Title" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Title" }),
                    'any.required': i18next.t('validation.required_message', { field: "Title" }),
                }),
            description: Joi.string()
                .min(1)
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Description" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Description" }),
                }),
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static updateCollection = async (req, res, next) => {        
        const Schema = Joi.object({
            title: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Title" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Title" }),
                }),
            description: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Description" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Description" }),
                })
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

}

module.exports = CollectionValidation;