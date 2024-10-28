const express = require('express');

const router = express.Router();

const UserController = require('../../controllers/manager/UserController');

router.patch('/toggle-status/:user_id', UserController.toggleStatus);

router.get('/', UserController.getAllUsers);

router.get('/:user_id', UserController.view);

router.delete('/', UserController.deleteManyUsers);

module.exports = router;