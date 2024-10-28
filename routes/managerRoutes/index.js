const express = require('express');

const router = express.Router();

router.use('/users', require("./userRoute"));

router.use('/magazines', require("./magazineRoute"));

router.use('/subscriptions', require("./subscriptionRoute"));

router.use('/payments', require("./PaymentRoute"));

router.use('/collections', require("./CollectionRoute"));

router.use('/logs', require("./LoggerRoute"));

module.exports = router;