const CollectionService = require('../../services/CollectionSerivce');
const JsonResponse = require('../../util/JsonResponse');
const HttpConstant = require('../../constants/HttpConstant');
const i18next = require("../../util/i18n/config");
const EmailService = require('../../util/email/EmailService');

class CollectionController {

    create = async (req, res, next) => {
        const body = req.body;
        try {
            const collection = await CollectionService.create(body);
            return JsonResponse.success(res, collection, i18next.t("create_message", { field: "Collection" }), HttpConstant.CREATE);
        } catch (error) {
            next(error)
        }
    };

    view = async (req, res, next) => {
        const { collection_id } = req.params;
        try {
            const collection = await CollectionService.findModel(collection_id);
            return JsonResponse.success(res, collection);
        } catch (error) {
            next(error)
        }
    };

    index = async (req, res, next) => {
        try {
            const collections = await CollectionService.list();
            return JsonResponse.success(res, collections);
        } catch (error) {
            next(error)
        }
    };

    updateCollection = async (req, res, next) => {
        const { collection_id } = req.params;
        const body = req.body;
        try {
            const collection = await CollectionService.update(body, collection_id);
            return JsonResponse.success(res, collection, i18next.t("update_message", { field: "Collection" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    deleteManyCollections = async (req, res, next) => {
        const { ids } = req.body;
        try {
            const collections = await CollectionService.deleteCollections(ids);
            return JsonResponse.success(res, collections, i18next.t("delete_message", { field: "Collection" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    relateMagazines = async (req, res, next) => {
        const { collection_id } = req.params;
        const { magazine_ids, deleteOlds } = req.body;
        try {
            const collections = await CollectionService.relateMagazines(collection_id, magazine_ids, deleteOlds);
            return JsonResponse.success(res, collections, i18next.t("create_message", { field: "Collection" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };

    unRelateMagazines = async (req, res, next) => {
        const { collection_id } = req.params;
        const { magazine_ids } = req.body;
        try {
            const collections = await CollectionService.unRelateMagazines(collection_id, magazine_ids);
            return JsonResponse.success(res, collections, i18next.t("delete_message", { field: "Collection" }), HttpConstant.OK);
        } catch (error) {
            next(error)
        }
    };
}

module.exports = new CollectionController();