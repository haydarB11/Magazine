'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {

      this.belongsTo(models.Magazine, {
        foreignKey: 'magazine_id',
        as: 'magazine',
        onDelete: "CASCADE",
      });

      this.hasMany(models.Comment, {
        foreignKey: 'article_id',
        as: 'comments',
      });

    }
  }
  Article.init({
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Title" }),
            }
        },
    },
    content: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Content" }),
            }
        },
    },
  }, {
    sequelize,
    modelName: 'Article',
    underscored: true,
  });

  return Article;
};