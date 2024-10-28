const SubscriptionStaticService = require('../../services/SubscriptionStaticService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class SubscriptionController {

    findAllForOneMagazine = async (req, res, next) => {
        const { magazine_id } = req.params;
        try {
            const subscriptions = await SubscriptionStaticService.findForOneMagazine(magazine_id);
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

    index = async (req, res, next) => {
        try {
            const subscriptions = await SubscriptionStaticService.findMagazineStatics();
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { id } = req.params;
        try {
            const subscription = await SubscriptionStaticService.findModel(id);
            return JsonResponse.success(res, subscription);
        } catch (error) {
            next(error)
        }
    };

    create = async (req, res, next) => {
        const body = req.body;
        try {
            const magazine = await SubscriptionStaticService.create(body);
            return JsonResponse.success(res, magazine, i18next.t("create_message", { field: "Subscription Static" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    update = async (req, res, next) => {
        const { magazine_id } = req.params;
        const body = req.body;
        try {
            const magazine = await SubscriptionStaticService.update(body, magazine_id);
            return JsonResponse.success(res, magazine, i18next.t("update_message", { field: "Subscription Static" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const magazines = await SubscriptionStaticService.deleteMany(ids);
            return JsonResponse.success(res, magazines, i18next.t("delete_message", { field: "Subscription Static" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    importFromExcel = async (req, res, next) => {
        const { path } = req.file;
        const { magazine_id } = req.params;
        try {
            const magazines = await SubscriptionStaticService.importFromExcelFile(path, magazine_id);
            return JsonResponse.success(res, magazines, i18next.t("create_message", { field: "Subscription Static" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new SubscriptionController();