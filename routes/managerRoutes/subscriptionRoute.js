const express = require('express');

const router = express.Router();

const SubscriptionController = require('../../controllers/manager/SubscriptionController');

const SubscriptionStaticController = require('../../controllers/manager/SubscriptionStaticController');

const SubscriptionStaticValidation = require('../../validation/SubscriptionStaticValidation');

const { uploadSubscriptionStatic } = require('../../util/uploadFiles/uploadDestinations');

// Subscription Statics

router.post('/statics/', SubscriptionStaticValidation.create, SubscriptionStaticController.create);

router.post('/statics/excel/:magazine_id', uploadSubscriptionStatic.single('file'), SubscriptionStaticValidation.importExcel, SubscriptionStaticController.importFromExcel);

router.get('/statics/', SubscriptionStaticController.index);

router.get('/statics/magazines/:magazine_id', SubscriptionStaticController.findAllForOneMagazine);

router.delete('/statics/', SubscriptionStaticValidation.delete, SubscriptionStaticController.delete);

// Subscription

router.get('/', SubscriptionController.index);

router.get('/magazines/:magazine_id', SubscriptionController.findAllForOneMagazine);

router.get('/subscribers/:subscriber_id', SubscriptionController.findAllForOneSubscriber);

router.get('/:subscription_id', SubscriptionController.view);

module.exports = router;