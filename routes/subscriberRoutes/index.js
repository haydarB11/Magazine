const express = require('express');
const router = express.Router();

router.use('/magazines', require("./magazineRoute"));

router.use('/subscriptions', require("./subscriptionRoute"));

module.exports = router;