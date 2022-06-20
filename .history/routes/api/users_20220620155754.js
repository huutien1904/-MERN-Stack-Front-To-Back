const express = require ('express')
const router = express.Router();
const {check,validationResult} = require('express-validator')
const User = require('./../../models/User')

// @route               POST api/users
// @desc                Register user
// @access              Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6}),
    ],

    async (req,res) =>{
    const errors = validationResult(req)
    console.log(errors);

//    if has error 
    if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
    }

//  if user exist
    const {name,email,password} = req.body
    try {
        let user = await User.findOne({email})
        console.log(user);
    } catch (error) {
        
    }
})


module.exports = router;