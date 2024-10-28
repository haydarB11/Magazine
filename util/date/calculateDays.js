

/**
 * @param {number} period 
 * @param {string} period_unit
 * @returns {number}
 */
function calculateDays(period, period_unit) {
    switch (period_unit) {
        case 'day':
            return period;
        case 'week':
            return period * 7;
        case 'month':
            return period * 30;
        case 'year':
            return period * 365;
        default:
            throw new Error('Invalid period_unit. Must be "day", "week", "month", or "year".');
    }
}

module.exports = calculateDays;