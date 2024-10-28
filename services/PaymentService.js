const { Payment, User, Subscription, Magazine, Sequelize } = require("../models");
const { Op, fn, col, literal } = Sequelize;

class PaymentService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Payment>|null}
     */
    async findModel(id) {
        const payment = await Payment.findByPk(id);
        return payment;
    }

    /**
     * @returns {Promise<Payment[]>}
     */
    async list() {
        const payments = await Payment.findAll({
            include: [
                {
                    model: Subscription,
                    as: 'subscription',
                    include: [
                        {
                            model: User,
                            as: 'user'
                        },
                        {
                            model: Magazine,
                            as: 'magazine'
                        }
                    ]
                }
            ],
            order: [
                ['id', 'DESC'],
            ],
        });
        return payments;
    };

    /**
     * @returns {Promise<Payment[]>}
     */
    async getPaymentsSumByMagazine (startingDate, endingDate) {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);
        const payments = await Payment.findAll({
            attributes: [
                'subscription.magazine_id',
                [fn('SUM', col('amount')), 'totalPayments'],
            ],
            include: [
                {
                    model: Subscription,
                    as: 'subscription',
                    attributes: ['starting_date', 'ending_date'],
                    include: [
                        {
                            model: Magazine,
                            as: 'magazine',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name'],
                        }
                    ],
                }
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                }
            },
            group: ['subscription.magazine_id'],
            order: [[literal('totalPayments'), 'DESC']],
        });
    
        return payments;
    };

}

module.exports = new PaymentService();