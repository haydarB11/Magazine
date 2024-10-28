
class BaseFilter {
    /**
     * @param {Object} options
     * @returns {Object}
     */
    build(options) {
        throw new Error('Subclasses must implement the build method');
    }
}

module.exports = BaseFilter;