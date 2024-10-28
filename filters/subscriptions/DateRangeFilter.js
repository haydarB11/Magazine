const BaseFilter = require('./BaseFilter');

const { Op } = require('../../models').Sequelize;


class DateRangeFilter extends BaseFilter {
    build(options) {
        if (!options.startDate || !options.endDate) return {};
        return {
            createdAt: {
                [Op.gte]: options.startDate,
                [Op.lte]: options.endDate
            }
        };
    }
}

module.exports = DateRangeFilter;