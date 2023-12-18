
const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require("../Middleware/fetchuser");


//Get logedin user_details using :POST "/api/auth/getuser"  :Login required 
router.get('/',fetchuser,(req,res)=>{
    res.send({name:req.user.name,email:req.user.email});
})
module.exports = router;