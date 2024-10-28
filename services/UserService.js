const i18next = require("../util/i18n/config");
const { User } = require("../models");
const { NotFoundError, UnauthorizedError } = require("../util/customError");
const { Op } = require("sequelize");
const UserRole = require("../constants/UserRole");
const UserActivation = require("../constants/UserActivation");
const Helper = require("../util/helper");

class UserService {

        /**
     * 
     * @param {number} id 
     * @returns {Promise<User>|null}
     */
        async findModel(id) {
            const user = await User.findByPk(id);
            user.toJSON();
            user.status = User.getStatusCodes()[user.status];
            return user;
        }

    /**
     * @param {Object} body 
     * @returns {User}
     */
    async create(body) {
        if (body.role === UserRole.publisher) {
            body.status = UserActivation.inactive;
        } else {
            body.status = UserActivation.active;
        }
        let user = await User.create(body);
        user = user.toJSON();
        delete user.password;
        delete user.role;
        delete user.status;
        return user;
    }

    /**
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<User>}
     */
    async update(body, id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "User" }));
        }
        user.name = body.name || user.name;
        user.email = body.email || user.email;
        await user.save();
        return user;
    };

    /**
     * @param {Object} body
     * @returns {Promise<User>}
     */
    async resetPassword(body) {
        const user = await User.unscoped().findOne({
            where: {
                email: body.email
            }
        });
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "User" }));
        }  
        const isSamePassword = await Helper.validPassword(body.oldPassword, user.password);           
        if (!isSamePassword) {
            throw new Error(i18next.t("validation.wrong_password_message", { field: "User" }));
        }
        if (body.newPassword !== body.confirmPassword) {
            throw new Error(i18next.t("validation.wrong_password_message", { field: "User" }));
        }
        user.password = body.newPassword;
        await user.save();
        return user;
    };

    /**
     * 
     * @param {string} email 
     * @param {string} password
     * @returns {Object}
     */
    async login(email, password) {
        let user = await User.scope(null).findOne({
            where: {
                email: email
            },
        });
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: email }));
        }
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
            throw new UnauthorizedError(i18next.t("validation.wrong_password_message", { field: password }));
        }
        if (user.status !== User.STATUS_ACTIVE) {
            throw new UnauthorizedError(i18next.t("validation.inactive_user_message"));
        }

        const token = await user.generateToken()
        user = user.toJSON();
        delete user.password;
        delete user.status;

        const responseData = {
            user,
            token
        }
        return responseData;
    };

    /**
     * 
     * @param {number} id 
     * @returns {Object}
     */
    async toggleStatus(id) {
        let user = await User.scope(null).findByPk(id);
        if (!user) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "User" }));
        }
        if (user.status === User.STATUS_ACTIVE) {
            user.status = User.STATUS_INACTIVE
        } else {
            user.status = User.STATUS_ACTIVE
        }
        await user.save();

        user = user.toJSON();
        delete user.password;
        delete user.role;
        user.status = User.getStatusCodes()[user.status];

        return user;
    };

    /**
     * @returns {Promise<User[]>}
     */
    async findUsers() {
        const users = await User.findAll({

        });
        const modifiedUsers = users.map(user => {
            user.setDataValue('status', User.getStatusCodes()[user.status]);
            return user;
        });
        return modifiedUsers;
    }

    /**
     * @param {number []} roles
     * @returns {Promise<User[]>}
     */
    async findUsersForManyRoles(roles = [1]) {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.in]: roles
                }
            }
        });
        const modifiedUsers = users.map(user => {
            user.setDataValue('status', User.getStatusCodes()[user.status]);
            return user;
        });
        return modifiedUsers;
    }

    /**
     * 
     * @param {number[]} ids
     * @returns {Promise<User[]>}
     */
    async deleteUsers(ids) {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        await User.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return users;
    };

}

module.exports = new UserService();