const express = require('express');

const router = express.Router();

router.use('/magazines', require("./magazineRoute"));

module.exports = router;