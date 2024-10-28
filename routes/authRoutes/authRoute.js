const express = require('express');

const router = express.Router();

const Authentication = require('../../middleware/Authentication');

const UserValidation = require('../../validation/UserValidation');

const AuthController = require('../../controllers/AuthController');

router.post('/register', UserValidation.createUser, AuthController.register);

router.post('/login', UserValidation.login, AuthController.login);

router.put('/reset-password', UserValidation.resetPassword, AuthController.resetPassword);

router.use(Authentication.isAuth);

router.get('/', AuthController.getAuth);

router.put('/', UserValidation.updateUser, AuthController.updateAccount);

module.exports = router;