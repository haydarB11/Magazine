

class FilterBuilder {
    constructor(filters) {
        this.filters = filters;
    }

    build(options) {
        return this.filters.reduce((whereClause, filter) => {
            return { ...whereClause, ...filter.build(options) };
        }, {});
    }
}

module.exports = FilterBuilder;