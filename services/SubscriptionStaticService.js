const { SubscriptionStatic, Magazine, Sequelize, sequelize } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;
const fs = require('fs');
const xlsx = require('xlsx');

class SubscriptionStaticService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<SubscriptionStatic>|null}
     */
    async findModel(id) {
        const subscription = await SubscriptionStatic.findByPk(id, {
            include: [
                {
                    required: false,
                    model: Magazine,
                    as: 'magazine'
                }
            ]
        });
        return subscription;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<SubscriptionStatic>}
     */
    async create(body) {
        let subscription = await SubscriptionStatic.findOne({
            where: {
                ...body
            }
        })
        if (!subscription) {
            subscription = await SubscriptionStatic.create(body);
        }
        return subscription;
    };

    /**
     * @param {string} path
     * @param {number} magazine_id
     * @returns {Promise<SubscriptionStatic []>}
     */
    async importFromExcelFile(path, magazine_id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const addedSubscriptions = [];
    
            const workbook = xlsx.readFile(path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
    
            const subscriptionPromises = jsonData.map(async (record) => {
                const data = {
                    period_unit: record["period unit"],
                    period: record["period"],
                    cost: record["cost"],
                    magazine_id: magazine_id,
                };
    
                const existingSubscriptionStatic = await SubscriptionStatic.findOne({
                    where: { ...data },
                    transaction,
                });
    
                if (!existingSubscriptionStatic && record["period"] && record["period unit"] && record["cost"]) {
                    const subscription = await SubscriptionStatic.create(data, { transaction });
                    addedSubscriptions.push(subscription);
                    return subscription;
                }
            });
    
            await Promise.all(subscriptionPromises);    
            await transaction.commit();    
            fs.unlinkSync(path);
    
            return addedSubscriptions;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw new NotFoundError(i18next.t("validation.internal_server_error", { field: "Subscription Static" }));
        }
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<SubscriptionStatic>}
     */
    async update(body, id) {
        const subscription = await SubscriptionStatic.findByPk(id);
        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Subscription Static" }));
        }
        subscription.period_unit = body.period_unit || subscription.period_unit;
        subscription.period = body.period || subscription.period;
        subscription.cost = body.cost || subscription.cost;
        await subscription.save();
        return subscription;
    };

    /**
     * 
     * @param {number} id 
     * @param {boolean} includeUser 
     * @returns {Promise<SubscriptionStatic>}
     */
    async findForOneMagazine(magazine_id) {
        const subscription = await SubscriptionStatic.findAll({
            where: {
                magazine_id: magazine_id
            },
            order: [['period_unit'], ['period']]
        });

        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Subscription Static" }));
        }

        return subscription;
    }

    /**
     * @param {boolean} includeUser 
     * @param {number} machine_id 
     * @returns {Promise<SubscriptionStatic[]>}
     */
    async findMagazineStatics() {
        const subscriptions = await SubscriptionStatic.findAll({
            include: [
                {
                    model: Magazine,
                    as: 'magazine'
                }
            ]
        });
        return subscriptions;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Promise<SubscriptionStatic>}
     */
    async delete(id) {
        const subscription = await SubscriptionStatic.findByPk(id);
        if (!subscription) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Subscription Static" }));
        }
        await subscription.destroy();
        return subscription;
    };

    /**
     * 
     * @param {number []} ids
     * @returns {Promise<SubscriptionStatic []>}
     */
    async deleteMany(ids) {
        const subscriptions = await SubscriptionStatic.findAll({
            include: [
                {
                    required: false,
                    model: Magazine,
                    as: 'magazine'
                }
            ],
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        await SubscriptionStatic.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return subscriptions;
    };
}

module.exports = new SubscriptionStaticService();