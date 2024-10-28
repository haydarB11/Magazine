'use strict';

const { Model } = require('sequelize');
const i18next = require('../util/i18n/config');
const { Sequelize } = require('.');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {

      this.belongsTo(models.Subscription, {
        foreignKey: 'subscription_id',
        as: 'subscription',
      });

      // this.belongsTo(models.User, {
      //   foreignKey: 'user_id',
      //   as: 'user',
      // });

    }
  }
  Payment.init({
    amount: {
        type: DataTypes.DOUBLE,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Amount" }),
            }
        },
    },
    payment_method: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: i18next.t("validation.empty_message", { field: "Payment Method" }),
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
        },
        defaultValue: sequelize.NOW
    },

  }, {
    sequelize,
    modelName: 'Payment',
    underscored: true,
  });

  return Payment;
};