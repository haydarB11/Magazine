const MagazineService = require("../services/MagazineService");
const { NotFoundError, ValidationError, ForbiddenError } = require("../util/customError");
const Joi = require('joi');
const i18next = require("../util/i18n/config");
const SubscriptionService = require("../services/SubscriptionService");

class MagazineValidation {
    static createMagazine = async (req, res, next) => {
        const Schema = Joi.object({
            name: Joi.string()
                .min(1)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Name" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Name" }),
                    'any.required': i18next.t('validation.required_message', { field: "Name" }),
                }),
            description: Joi.string()
                .min(1)
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Description" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Description" }),
                }),
            date: Joi.date()
                .required()
                .messages({
                    'date.base': i18next.t('validation.date_message', { field: "Date" }),
                    'any.required': i18next.t('validation.required_message', { field: "Date" }),
                }),
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static updateMagazine = async (req, res, next) => {        
        const Schema = Joi.object({
            name: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Name" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Name" }),
                }),
            description: Joi.string()
                .min(1)
                .optional()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Description" }),
                    'string.empty': i18next.t('validation.empty_message', { field: "Description" }),
                }),
            date: Joi.date()
                .optional()
                .messages({
                    'date.base': i18next.t('validation.date_message', { field: "Date" }),
                })
        });

        const { error } = Schema.validate({ ...req.body }, { abortEarly: false });
        // const { error } = Schema.validate({ ...req.params, ...req.body }, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static deleteMagazines = async (req, res, next) => {
        const Schema = Joi.object({
            ids: Joi.array()
                .items(
                    Joi.number()
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
                )
                .min(1)
                .required()
                .messages({
                    'array.base': i18next.t('validation.array_message', { field: "Magazine IDs" }),
                    'array.min': i18next.t('validation.min_array_message', { field: "Magazine IDs" }),
                    'any.required': i18next.t('validation.required_message', { field: "Magazine IDs" }),
                })
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error.details.map(detail => detail.message)));
        }
        next();
    };

    static validateMagazineOwnership = async (req, res, next) => {
        const { magazine_id } = req.params;        

        const idSchema = Joi.number().integer().positive().required();
        const { error } = idSchema.validate(magazine_id);
        if (error) {
            return next(new ValidationError(i18next.t('validation.invalid_id_message', { field: "Magazine ID" })));
        }

        try {
            const magazine = await MagazineService.findModel(magazine_id);
            if (!magazine) {
                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
            }

            if (magazine.user_id !== req.user.id && req.user.role !== 1) {
                throw new ForbiddenError(i18next.t("error.access_forbidden", { field: "Magazine" }));
            }

            next();
        } catch (error) {
            next(error);
        }
    };

    static validateMagazineSubscribe = async (req, res, next) => {
        const { magazine_id } = req.params;

        const idSchema = Joi.number().integer().positive().required();
        const { error } = idSchema.validate(magazine_id);
        if (error) {
            return next(new ValidationError(i18next.t('validation.invalid_id_message', { field: "Magazine ID" })));
        }

        try {
            const magazine = await SubscriptionService.getForUserInMagazine(req.user.id, magazine_id);
            if (!magazine) {
                throw new ForbiddenError(i18next.t("error.access_forbidden", { field: "Magazine" }));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = MagazineValidation;