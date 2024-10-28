const { Magazine, CollectionMagazine, Collection, Sequelize } = require("../models");
const { NotFoundError } = require("../util/customError");
const i18next = require("../util/i18n/config");
const { Op } = Sequelize;

class CollectionService {

    /**
     * 
     * @param {number} id 
     * @returns {Promise<Collection>|null}
     */
    async findModel(id) {
        const collection = await Collection.findOne({
            where: {
                id: id
            }
        });
        return collection;
    }

    /**
     * @param {Object} body 
     * @returns {Promise<Collection>}
     */
    async create(body) {
        const collection = await Collection.create(body);
        return collection;
    };

    /**
     * 
     * @param {Object} body 
     * @param {number} id 
     * @returns {Promise<Collection>}
     */
    async update(body, id) {
        const collection = await Collection.findByPk(id);
        if (!collection) {
            throw new NotFoundError(i18next.t("validation.not_found_message", { field: "Collection" }));
        }
        collection.title = body.title || collection.title;
        collection.description = body.description || collection.description;
        await collection.save();
        return collection;
    };

    /**
     * @returns {Promise<Collection[]>}
     */
    async list() {
        const collections = await Collection.findAll({
            include: [
                {
                    model: Magazine,
                    as: 'magazines',
                    through: { attributes: [] }
                }
            ]
        });
        return collections;
    };

    /**
     * 
     * @param {number[]} ids
     * @returns {Promise<Collection[]>}
     */
    async deleteCollections(ids) {
        const collection = await Collection.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })
        await Collection.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return collection;
    };

    /**
     * @param {number} collection_id
     * @param {number[]} magazine_ids
     * @returns {Promise<void>}
     */
    async relateMagazines(collection_id, magazine_ids, deleteOlds = false) {
        const collection = await Collection.findByPk(collection_id);
        if (!collection) {
            throw new NotFoundError(i18next.t('validation.not_found', { field: "Collection" }));
        }

        const validMagazines = await Magazine.findAll({
            where: { id: magazine_ids }
        });
        const validMagazineIds = validMagazines.map(m => m.id);
    
        if (validMagazineIds.length !== magazine_ids.length) {
            throw new NotFoundError(i18next.t('validation.not_found', { field: "Collection" }));
        }

        if (deleteOlds) {
            await collection.setMagazines([]);
        }

        const magazineAssociations = magazine_ids.map(magazine_id => ({
            collection_id: collection_id,
            magazine_id: magazine_id
        }));

        await CollectionMagazine.bulkCreate(magazineAssociations, { ignoreDuplicates: false });
        const updatedCollection = await Collection.findByPk(collection_id, {
            include: [
                {
                    required: false,
                    model: Magazine,
                    as: 'magazines',
                    through: { attributes: [] }
                }
            ]
        });
    
        return updatedCollection;    
    }

    /**
     * @param {number} collection_id
     * @param {number[]} magazine_ids
     * @returns {Promise<void>}
     */
    async unRelateMagazines(collection_id, magazine_ids) {
        const collection = await Collection.findByPk(collection_id, {
            include: [
                {
                    required: false,
                    model: Magazine,
                    as: 'magazines',
                    through: { attributes: [] }
                }
            ]
        });
        if (!collection) {
            throw new NotFoundError(i18next.t('validation.not_found', { field: "Collection" }));
        }

        await collection.removeMagazines(magazine_ids);
        return collection;
    }

}

module.exports = new CollectionService();