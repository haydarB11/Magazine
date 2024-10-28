const MagazineService = require('../../services/MagazineService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class MagazineController {

    index = async (req, res, next) => {
        try {
            const magazines = await MagazineService.findMagazines();
            return JsonResponse.success(res, magazines);
        } catch (error) {
            next(error)
        }
    };

    getAllMyMagazinesForOnePublisher = async (req, res, next) => {
        const { publisher_id } = req.params;
        try {
            const includeArticles = false;
            const magazines = await MagazineService.findMagazinesForOnePublisher(publisher_id, includeArticles);
            return JsonResponse.success(res, magazines);
        } catch (error) {
            next(error)
        }
    };

    getAllMyMagazines = async (req, res, next) => {
        const subscriber_id = req.user.id;
        try {
            const magazines = await MagazineService.findMagazinesForOneSubscriber(subscriber_id);
            return JsonResponse.success(res, magazines);
        } catch (error) {
            next(error)
        }
    };

    getSuggestionMagazinesNotSubscribeInYet = async (req, res, next) => {
        const { magazine_id } = req.params;
        const { limit, offset } = req.query;
        try {
            const magazines = await MagazineService.findRelatedMagazinesPagination(magazine_id, limit, offset);
            return JsonResponse.success(res, magazines);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { magazine_id } = req.params;
        try {
            const magazine = await MagazineService.findModel(magazine_id);
            return JsonResponse.success(res, magazine);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new MagazineController();