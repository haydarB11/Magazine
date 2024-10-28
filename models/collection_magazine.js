'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class CollectionMagazine extends Model {
    static associate(models) {

    }
  }
  CollectionMagazine.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  }, {
    sequelize,
    modelName: 'CollectionMagazine',
    underscored: true,
  });

  return CollectionMagazine;
};