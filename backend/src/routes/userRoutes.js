 // route to handel user auth

 const express = require('express');
 const userController = require('../controllers/UserController');

 const router = express.Router();

 router.get('/login', userController.showLoginForm);
 router.post('/login', userController.login);
 router.get('/register', userController.showRegisterForm);
 router.post('/register', userController.register);

 module.export = router;
