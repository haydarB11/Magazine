const SubscriptionService = require('../../services/SubscriptionService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class SubscriptionController {

    // it can be using query params to get the last one for each magazine or for all subscriptions
    findAllForOneSubscriber = async (req, res, next) => {
        const { subscriber_id } = req.params;
        try {
            const subscriptions = await SubscriptionService.findAllForOneSubscription(subscriber_id);
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

    findAllForOneMagazine = async (req, res, next) => {
        const { magazine_id } = req.params;
        try {
            const subscriptions = await SubscriptionService.findAllForOneMagazine(magazine_id);
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

    index = async (req, res, next) => {
        try {
            const subscriptions = await SubscriptionService.list();
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { subscription_id } = req.params;
        try {
            const subscription = await SubscriptionService.findModel(subscription_id);
            return JsonResponse.success(res, subscription);
        } catch (error) {
            next(error)
        }
    };

    delete = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const subscriptions = await SubscriptionService.delete(ids);
            return JsonResponse.success(res, subscriptions, i18next.t("delete_message", { field: "Subscription" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new SubscriptionController();