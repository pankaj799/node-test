var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/Auth');
var middleware = require("../controllers/middleware");

// Auth Routes without token
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/update', middleware.checkToken, AuthController.update);
router.post('/logout', middleware.checkToken, AuthController.logout);

// Common Routes
router.get('*',(req,res) => {res.status(405).json({status:false, message:"Invalid Get Request"})});
router.post('*',(req,res) => {res.status(405).json({status:false, message:"Invalid Post Request"})});
module.exports = router;