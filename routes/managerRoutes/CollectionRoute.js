const express = require('express');

const router = express.Router();

const CollectionController = require('../../controllers/manager/CollectionController');

const CollectionValidation = require('../../validation/CollectionValidation');

// collection magazines

router.post('/magazines/relate/:collection_id', CollectionController.relateMagazines);

router.delete('/magazines/un-relate/:collection_id', CollectionController.unRelateMagazines);

// collections

router.post('/', CollectionValidation.createCollection, CollectionController.create);

router.put('/:collection_id', CollectionValidation.updateCollection, CollectionController.updateCollection);

router.delete('/', CollectionController.deleteManyCollections);

router.get('/', CollectionController.index);

router.get('/:collection_id', CollectionController.view);


module.exports = router;