
const express = require("express");  //importing stt
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetchuser=require('../Middleware/fetchuser')
var jwt = require('jsonwebtoken');
// router.get('/',(req, res) => { 
//     console.log(req.body);
//     res.send("Hellow");
//   })
const jwt_signetur = "hellowIamJwtsign@sign";  //secure jwt tocken signeture

//Route1: create a user using : POST /api/auth . Doesnt reqire authentication(login) to hit this endpoint.
router.post('/createuser', [
  body('name', 'Name must have a minimum of 3 characters').isLength({ min: 3 }),
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });   //return if the data contains errors
  }
  // res.send(`Hello, ${req.body.name}!`);
  // User(req.body).save();   //will directly save data onto database

  // User(req.body).save().then(user=>res.json(user));   //this code also work as same as above but if we want do not want all the data from res to send to db then use below code format

  // will save data into db
  // User.create({
  //   name:req.body.name,
  //   email:req.body.email,
  //   password:req.body.password
  // }).then(user=>res.json(user))  //will send res a json file of user
  // .catch(err=> res.status(400).send(err));  
  // // res.send("ok");

  //to check whether the email entered is unique or not
  try{
    //check whether the user with the email already exist
    const user_email = await User.findOne({ email: req.body.email });
    console.log(user_email);
    if (user_email) {
      return res.status(401).send({error:"The email is already registered...Please try another one"});
    }

    //hashing a password
    const salt=await bcrypt.genSalt(10);   //will generate a salt to add to the passsword
    const secPass=await bcrypt.hash(req.body.password,salt);   //will hash the password with salt and generate the hashed string
    const user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });
    console.log(user.id);
    const data={
      id: user.id,
      name:user.name,
      email:user.email
    };
    const jwt_signetur="hellowIamJwtsign@sign";  //secure jwt tocken signeture
    const authTocken=jwt.sign(data,jwt_signetur);
    console.log(authTocken);
    return res.send({tocken:authTocken,message:"Account created successfully"});
  } catch(error){
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

  })

  //Router2: Authentication of a user using : POST "/api/auth/login"  :No login required
  router.post('/login', [
    body('email', "Enter valid email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).send({ errors: errors.array() });   //return if the data contains errors
    }
    try {
        const { email, password } = req.body;  //destructured email and password from body
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({error:"User not found"});
        }
        // console.log(user.password);
        var hash = user.password;
        const check_validation = bcrypt.compareSync(password, hash);
        if (!check_validation) {    //if checkvalidation is false
            console.log("Invalid credentials");
            return res.status(401).send({error:"Invalid credentials"});
        }
        // else {
        // console.log("Login Successful \n" + user.email);
        // res.send("Login Suceeful");
        // }

        //now instead of using the data directly we will use jwt
        const data = {    //payload over jwt
            user: {
                id: user.id,
                name:user.name,
                email:user.email
            }
        };
        
        const authTocken = jwt.sign(data, jwt_signetur);
        console.log(authTocken);
        return res.send({tocken:authTocken,message:"Login successful"});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server Error");
    }
}
)

  //Router3: Get loggedin user details using: POST "/api/auth/getuser" :Login required  
  router.post('/getuser',fetchuser,async(req,res)=>{
    try {
      const userID=await req.user.id;
      const user=await User.findById(userID).select("-password")   //select all data from user matching with the userID except password
      // console.log(user);
      return res.send("Welcome "+user.name);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error");
    }
  })
module.exports = router;
