const express = require('express');

const router = express.Router();

const Authentication = require('../middleware/Authentication');

const Permission = require('../middleware/Permission');

router.use('/auth', require("./authRoutes/authRoute"));

router.use(Authentication.isAuth);

router.use('/subscribers', require("./subscriberRoutes"));

router.use('/publishers', Permission.isPublisher, require("./publisherRoutes"));

router.use('/managers', Permission.isManager, require("./managerRoutes"));

module.exports = router;