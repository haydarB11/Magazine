const DateRangeFilter = require("../filters/subscriptions/DateRangeFilter");
const FilterBuilder = require("../filters/subscriptions/FilterBuilder");
const StatusFilter = require("../filters/subscriptions/StatusFilter");
const { Subscription, User, Magazine, SubscriptionStatic, Payment, Sequelize, sequelize } = require("../models");
const { NotFoundError } = require("../util/customError");
const calculateDays = require("../util/date/calculateDays");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;

class SubscriptionService {

    constructor() {
        this.filterBuilder = new FilterBuilder([
            new StatusFilter(),
            new DateRangeFilter(),
        ]);
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Subscription>|null}
     */
    async findModel(id) {
        const subscription = await Subscription.findOne({
            include: [
                {
                    model: Magazine,
                    as: 'magazine'
                },
                {
                    model: SubscriptionStatic,
                    as: 'subscription_static'
                }
            ],
            where: {
                id: id
            }
        });
        return subscription;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Subscription>}
     */
    async create(body) {
        const transaction = await sequelize.transaction();
        try {
            const subscriptionStatic = await this.#getSubscriptionStaticModel(body.subscription_static_id, transaction);
            const daysOfSubscription = calculateDays(subscriptionStatic.period, subscriptionStatic.period_unit)
            body.starting_date = new Date();
            body.ending_date = new Date(body.starting_date);
            body.ending_date.setDate(body.starting_date.getDate() + daysOfSubscription);
            body.magazine_id = subscriptionStatic.magazine_id;

            const subscription = await Subscription.create(body, { transaction });

            const payment = await this.#createPayment(subscription, body, transaction);

            await transaction.commit();
            subscription.setDataValue('payment', payment);
            return subscription
        } catch (error) {
            await transaction.rollback();
            throw new Error(i18next.t("error.internal_server_error", { field: "Subscription" }));
        }
    }

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Subscription>}
     */
    async update(body, id) {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "subscription" }));
        }
        subscription.text = body.text || subscription.text;
        await subscription.save();
        return subscription;
    };

    /**
     * 
     * @param {number} id 
     * @param {boolean} includeUser 
     * @returns {Promise<Subscription>}
     */
    async get(id, includeUser = false) {
        const subscription = await Subscription.findByPk(id, {
            include: includeUser ? ["user"] : [],
        });

        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Subscription" }));
        }

        return subscription;
    }

    /**
     * 
     * @param {number} id 
     * @param {boolean} includeUser 
     * @returns {Promise<Subscription>}
     */
    async getAllEndsTomorrow() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const subscriptions = await Subscription.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Magazine,
                    as: 'magazine'
                }
            ],
            where: {
                ending_date: {
                    [Op.between]: [today, tomorrow]
                }
            }
        });

        return subscriptions;
    }

    /**
     * 
     * @param {number} user_id 
     * @param {number} magazine_id 
     * @returns {Promise<Subscription>}
     */
    async getForUserInMagazine(user_id, magazine_id) {
        const today = new Date();

        const subscription = await Subscription.findOne({
            where: {
                starting_date: {
                    [Op.lte]: today 
                },
                ending_date: {
                    [Op.gt]: today 
                },
                user_id: user_id,
                magazine_id: magazine_id
            }
        });

        return subscription;
    }

    /**
     * 
     * @param {number} subscriber_id 
     * @returns {Promise<Subscription []>}
     */
    async findAllForOneSubscription(subscriber_id) {
        const subscriptions = await Subscription.findAll({
            include: [
                {
                    model: Magazine,
                    as: 'magazine'
                },
                {
                    model: SubscriptionStatic,
                    as: 'subscription_static'
                }
            ],
            where: {
                user_id: subscriber_id
            }
        });
        return subscriptions;
    }

    /**
     * 
     * @param {number} magazine_id 
     * @returns {Promise<Subscription []>}
     */
    async findAllForOneMagazine(magazine_id) {
        const subscriptions = await Subscription.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            where: {
                magazine_id: magazine_id
            }
        });
        return subscriptions;
    }

    /**
     * @returns {Promise<Subscription[]>}
     */
    async list() {
        let subscriptions;
        subscriptions = await Subscription.findAll({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ],
            order: [
                ['id', 'DESC'],
            ],
        });
        return subscriptions;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Subscription>}
     */
    async delete(id) {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Note" }));
        }
        await subscription.destroy();
        return subscription;
    };

    /**
     * @param {Subscription} subscription 
     * @param {Transaction} transaction
     * @returns {Promise<Payment>}
     */
    async #createPayment(subscription, body, transaction) {
        // here should check for payment if equal to cost or throw error
        const today = new Date();
        const paymentBody = {
            subscription_id: subscription.id,
            amount: body.amount, // or take it from subscription static
            payment_method: body.payment_method,
            date: today,
        };

        // here should be the payment callback function

        return Payment.create(paymentBody, { transaction });
    };

    /**
     * @param {Subscription} subscription_static_id
     * @returns {Promise<SubscriptionStatic>}
     */
    async #getSubscriptionStaticModel(subscription_static_id, transaction) {

        return SubscriptionStatic.findByPk(subscription_static_id, { transaction });
    };
}

module.exports = new SubscriptionService();