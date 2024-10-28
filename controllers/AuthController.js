const HttpConstant = require('../constants/HttpConstant');
const UserActivation = require('../constants/UserActivation');
const UserRole = require('../constants/UserRole');
const UserService = require('../services/UserService');
const JsonResponse = require('../util/JsonResponse');
const i18next = require('../util/i18n/config');

class AuthController {

    register = async (req, res, next) => {
        const { body } = req;
        try {
            const user = await UserService.create(body)
            return JsonResponse.success(res, user, i18next.t("create_message", { field: "User" }), HttpConstant.CREATE);
        } catch (error) {
            next(error);
        }
    };

    updateAccount = async (req, res, next) => {
        const { body } = req;
        const { id } = req.user;
        try {
            const user = await UserService.update(body, id)
            return JsonResponse.success(res, user, i18next.t("update_message", { field: "User" }), HttpConstant.CREATE);
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        const { body } = req;
        try {
            const user = await UserService.resetPassword(body)
            return JsonResponse.success(res, user, i18next.t("update_message", { field: "User" }), HttpConstant.CREATE);
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const data = await UserService.login(email, password);
            return JsonResponse.success(res, data, i18next.t("success_message", { field: "Login" }), HttpConstant.OK);
        } catch (error) {
            next(error);
        }
    };

    getAuth = async (req, res, next) => {
        const { id } = req.user;
        try {
            const data = await UserService.findModel(id);
            return JsonResponse.success(res, data);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController()
