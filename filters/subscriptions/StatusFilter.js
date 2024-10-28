const BaseFilter = require("./BaseFilter");


class StatusFilter extends BaseFilter {
    build(options) {
        if (!options.status) return {};
        return { status: options.status };
    }
}

module.exports = StatusFilter;