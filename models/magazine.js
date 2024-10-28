'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class Magazine extends Model {
    static associate(models) {

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: "CASCADE",
      });

      this.hasMany(models.Subscription, {
        foreignKey: 'magazine_id',
        as: 'subscriptions',
        onDelete: "CASCADE",
      });

      this.hasMany(models.SubscriptionStatic, {
        foreignKey: 'magazine_id',
        as: 'subscription_statics',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.Article, {
        foreignKey: 'magazine_id',
        as: 'articles',
        onDelete: 'CASCADE',
      });

      this.belongsToMany(models.Collection, {
        foreignKey: 'magazine_id',
        as: 'collections',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        through: models.CollectionMagazine,
      });

    }
  }
  Magazine.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Name" }),
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
    date: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Date" }),
            }
        }
    },
  }, {
    sequelize,
    modelName: 'Magazine',
    underscored: true,
  });

  return Magazine;
};