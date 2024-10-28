const HttpConstant = require('../../constants/HttpConstant');
const UserService = require('../../services/UserService');
const JsonResponse = require('../../util/JsonResponse');
const i18next = require("../../util/i18n/config");

class UserController {

    toggleStatus = async (req, res, next) => {
        const { user_id } = req.params;
        try {
            const result = await UserService.toggleStatus(user_id);
            return JsonResponse.success(res, result, i18next.t("update_message", { field: "User" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    getAllUsers = async (req, res, next) => {
        try {
            const users = await UserService.findUsers();
            return JsonResponse.success(res, users);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { user_id } = req.params;
        try {
            const users = await UserService.findModel(user_id);
            return JsonResponse.success(res, users);
        } catch (error) {
            next(error)
        }
    };

    deleteManyUsers = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const users = await UserService.deleteUsers(ids);
            return JsonResponse.success(res, users, i18next.t("delete_message", { field: "User" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new UserController();