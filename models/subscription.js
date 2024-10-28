'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {

      this.hasMany(models.Payment, {
        foreignKey: 'Subscription_id',
        as: 'payments',
      });

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.Magazine, {
        foreignKey: 'magazine_id',
        as: 'magazine',
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.SubscriptionStatic, {
        foreignKey: 'subscription_static_id',
        as: 'subscription_static',
        onDelete: 'CASCADE',
      });

    }
  }
  Subscription.init({
    starting_date: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Starting Date" }),
            }
        }
    },
    ending_date: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Ending Date" }),
            }
        }
    },
  }, {
    sequelize,
    modelName: 'Subscription',
    underscored: true,
  });

  return Subscription;
};