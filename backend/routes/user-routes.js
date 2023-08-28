const path = require('path');

const express = require('express');

const userController = require('../controllers/user-controller');

const router = express.Router();

// /users => GET
router.get('/users', userController.getUsers);

// /users => POST
router.post('/users',userController.postUsers);

// /user/:id => GET
router.get('/user/:id',userController.getUser);

// /user/:id => DELETE
router.delete('/user/:id',userController.deleteUser);

module.exports = router;
