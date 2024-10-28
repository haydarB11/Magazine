const express = require('express');

const router = express.Router();

const PaymentController = require('../../controllers/manager/PaymentController');

router.get('/', PaymentController.index);

router.get('/sum', PaymentController.getSumOfAllPaymentsBetweenTwoDates);

module.exports = router;