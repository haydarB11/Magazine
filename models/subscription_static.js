'use strict';

const { Model } = require('sequelize');
const { period_units } = require('./enum.json');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class SubscriptionStatic extends Model {
    static associate(models) {

      this.belongsTo(models.Magazine, {
        foreignKey: 'magazine_id',
        as: 'magazine',
      });

      this.hasMany(models.Subscription, {
        foreignKey: 'subscription_static_id',
        as: 'subscriptions',
        onDelete: 'CASCADE',
      });

    }
  }
  SubscriptionStatic.init({
    period_unit: {
      type: DataTypes.ENUM,
      values: period_units,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: i18next.t("validation.empty_message", { field: "Period Unit" }),
        },
        len: {
          args: [1, 50],
          msg: "Subscription must be between 1 and 50 characters long",
        },
      },
    },
    period: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Period Value" }),
            }
        }
    },
    cost: {
        type: DataTypes.DOUBLE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Cost" }),
            }
        }
    },
  }, {
    sequelize,
    modelName: 'SubscriptionStatic',
    underscored: true,
  });

  return SubscriptionStatic;
};