const { ForbiddenError } = require("../util/customError");

class Permission {
    static isManager = async (req, res, next) => {
        if (req.user.role === 1) {
            next();
        } else {
            return next(new ForbiddenError());
        }
    };

    static isPublisher = async (req, res, next) => {
        if (req.user.role === 2) {
            next();
        } else {
            return next(new ForbiddenError());
        }
    };
}


module.exports = Permission;