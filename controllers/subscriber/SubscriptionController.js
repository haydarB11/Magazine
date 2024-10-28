const SubscriptionService = require('../../services/SubscriptionService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");
const UserService = require('../../services/UserService');
const EmailService = require('../../util/email/EmailService');

class SubscriptionController {

    create = async (req, res, next) => {
        const body = req.body;
        body.user_id = req.user.id;
        try {
            const subscription = await SubscriptionService.create(body);
            const subject = 'New Subscription';
            const text = `new subscription with ${body.amount} as payment`;
            const managers = await UserService.findUsersForManyRoles();
            for (let i = 0; i < managers.length; i++) {
                const to = managers[i].email;
                await EmailService.sendMail({to, subject, text});
            }
            return JsonResponse.success(res, subscription, i18next.t("create_message", { field: "Subscription" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    // it can be using query params to get the last one for each magazine or for all subscriptions
    findAllForOneSubscriber = async (req, res, next) => {
        const subscriber_id = req.user.id;
        try {
            const subscriptions = await SubscriptionService.findAllForOneSubscription(subscriber_id);
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
}

module.exports = new SubscriptionController();