const MagazineService = require('../../services/MagazineService');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");

class MagazineController {

    create = async (req, res, next) => {
        const body = req.body;
        try {
            
            body.user_id = req.user.id;
            const magazines = await MagazineService.create(body);
            return JsonResponse.success(res, magazines, i18next.t("create_message", { field: "Magazine" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    index = async (req, res, next) => {
        try {
            const magazines = await MagazineService.findMagazines();
            return JsonResponse.success(res, magazines);
        } catch (error) {
            next(error)
        }
    };

    getAllMyMagazines = async (req, res, next) => {
        const publisher_id = req.user.id;
        try {
            const magazines = await MagazineService.findMagazinesForOnePublisher(publisher_id);
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

    updateMagazine = async (req, res, next) => {
        const { magazine_id } = req.params;
        const body = req.body
        try {
            const magazine = await MagazineService.update(body, magazine_id);
            return JsonResponse.success(res, magazine, i18next.t("update_message", { field: "Magazine" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    deleteManyMagazines = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const magazines = await MagazineService.deleteMagazines(ids);
            return JsonResponse.success(res, magazines, i18next.t("update_message", { field: "Magazine" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new MagazineController();