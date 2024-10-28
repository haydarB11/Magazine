const SubscriptionStaticService = require('../../services/SubscriptionStaticService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class SubscriptionController {

    findAllFiltered = async (req, res, next) => {
        const { magazine_id } = req.params;
        try {
            const subscriptions = await SubscriptionStaticService.findForOneMagazine(magazine_id);
            return JsonResponse.success(res, subscriptions);
        } catch (error) {
            next(error)
        }
    };

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
}

module.exports = new SubscriptionController();