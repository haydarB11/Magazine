'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {

      this.belongsToMany(models.Magazine, {
        foreignKey: 'collection_id',
        as: 'magazines',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        through: models.CollectionMagazine,
      });

    }
  }
  Collection.init({
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Title" }),
            }
        },
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Description" }),
            }
        },
    },
  }, {
    sequelize,
    modelName: 'Collection',
    underscored: true,
  });

  return Collection;
};