const Joi = require('joi');
const i18next = require("../util/i18n/config");
const { ValidationError } = require('../util/customError');
const { period_units } = require('../models/enum.json');
const SubscriptionStaticService = require('../services/SubscriptionStaticService');

class SubscriptionStaticValidation {

    static create = async (req, res, next) => {
        const Schema = Joi.object({
            period_unit: Joi.string()
                .valid(...period_units)
                .required()
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Period Unit" }),
                    'any.only': i18next.t('validation.invalid_value', { field: "Period Unit" }),
                    'any.required': i18next.t('validation.required_message', { field: "Period Unit" }),
                }),
            period: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Period" }),
                    'number.integer': i18next.t('validation.integer_message', { field: "Period" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Period" }),
                    'any.required': i18next.t('validation.required_message', { field: "Period" }),
                }),
            cost: Joi.number()
                .positive()
                .required()
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Cost" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Cost" }),
                    'any.required': i18next.t('validation.required_message', { field: "Cost" }),
                }),
            magazine_id: Joi.number()
                .positive()
                .required()
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Cost" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Cost" }),
                    'any.required': i18next.t('validation.required_message', { field: "Cost" }),
                }),
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static update = async (req, res, next) => {
        const Schema = Joi.object({
            period_unit: Joi.string()
                .valid(...period_units)
                .messages({
                    'string.base': i18next.t('validation.string_message', { field: "Period Unit" }),
                    'any.only': i18next.t('validation.invalid_value', { field: "Period Unit" }),
                }),
            period: Joi.number()
                .integer()
                .positive()
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Period" }),
                    'number.integer': i18next.t('validation.integer_message', { field: "Period" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Period" }),
                }),
            cost: Joi.number()
                .positive()
                .messages({
                    'number.base': i18next.t('validation.number_message', { field: "Cost" }),
                    'number.positive': i18next.t('validation.positive_message', { field: "Cost" }),
                }),
        });

        const { error } = Schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationError(null, error));
        }
        next();
    };

    static delete = async (req, res, next) => {
        const Schema = Joi.object({
            ids: Joi.array()
                .items(
                    Joi.number()
                        .integer()
                        .positive()
                        .required()
                        .custom(async (value, helpers) => {
                            const magazine = await SubscriptionStaticService.findModel(value);
                            if (!magazine) {
                                throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Magazine" }));
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
            return next(new ValidationError(null, error));
        }
        next();
    };

    static importExcel = async (req, res, next) => {
        if (!req.file) {
            return next(new ValidationError(i18next.t("validation.required_message", { field: "Excel File" })));
        }
        const { originalname } = req.file;
        if (!originalname.endsWith('.xlsx') && !originalname.endsWith('.xls')) {
            return next(new ValidationError(i18next.t("validation.invalid_file_type", { field: "Excel File" })));
        }
        next();
    };
}

module.exports = SubscriptionStaticValidation;
