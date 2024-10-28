const CommentService = require('../../services/CommentService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");
const PaymentService = require('../../services/PaymentService');

class PaymentController {

    index = async (req, res, next) => {
        try {
            const payments = await PaymentService.list();
            return JsonResponse.success(res, payments);
        } catch (error) {
            next(error)
        }
    };

    getSumOfAllPaymentsBetweenTwoDates = async (req, res, next) => {
        const { startingDate, endingDate } = req.query;
        try {
            const payments = await PaymentService.getPaymentsSumByMagazine(startingDate, endingDate);
            return JsonResponse.success(res, payments);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new PaymentController();