'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');
const { Sequelize } = require('.');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Article, {
        foreignKey: 'article_id',
        as: 'article',
      });

    }
  }
  Comment.init({
    comment: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Comment" }),
            }
        },
    },
    is_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    date: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Date" }),
            }
        },
        defaultValue: sequelize.NOW
    },
  }, {
    sequelize,
    modelName: 'Comment',
    underscored: true,
  });

  return Comment;
};