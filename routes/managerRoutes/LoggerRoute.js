const express = require('express');

const router = express.Router();

const LoggerController = require('../../controllers/manager/LoggerController');

const checkFileExists = require('../../middleware/fileExist');


router.get('/', LoggerController.index);

router.get('/:filename', checkFileExists, LoggerController.read);

router.post('/:filename', checkFileExists, LoggerController.download);

router.delete('/:filename', checkFileExists, LoggerController.delete);


module.exports = router;