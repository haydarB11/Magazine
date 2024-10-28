const express = require('express');

const router = express.Router();

const SubscriptionController = require('../../controllers/subscriber/SubscriptionController');

const SubscriptionStaticController = require('../../controllers/subscriber/SubscriptionStaticController');

const SubscriptionValidation = require('../../validation/SubscriptionValidation');

// Subscription Statics

router.get('/statics/', SubscriptionStaticController.index);

router.get('/statics/magazines/:magazine_id', SubscriptionStaticController.findAllForOneMagazine);

// Subscription

router.post('/', SubscriptionController.create);

router.get('/', SubscriptionController.findAllForOneSubscriber);

router.get('/:subscription_id', SubscriptionController.view);

module.exports = router;