const router = require("express").Router()
const User = require("../models/user-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



router.post("/signup", async (req, res) => {

    try {

        const checkExistingByEmail = await User.find({ email: req.body.email })
        // const checkExistingByPhone = await User.find({ phone: req.body.phone })

        if (checkExistingByEmail.length) {
            return res.status(400).json(`User With this ${req.body.email} email already exists`)
        }
        // if (checkExistingByPhone.length) {
        //     return res.status(400).json(`User With this ${req.body.phone} phone number already exists`)
        // }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        req.body.password = hashedPassword

        const newUser = await User(req.body)
        await newUser.save()

        newUser.password = null;

        res.json(newUser)
    } catch (error) {
        //console.log(error);
    }
})

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        //console.log(req.body);
        const getUserbyMail = await User.find({ email: email })
        // const getUserbyPhone = await User.find({ phone: email })

        const user = getUserbyMail[0]

        if (getUserbyMail.length ) {
            const hashedPassword = getUserbyMail[0].password 
            const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
            //console.log(isPasswordCorrect);
            if (isPasswordCorrect) {
                const user_id =  getUserbyMail[0]._id
                const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET)
                res.status(200).json({ user:user.username, token })
                //console.log("here");
            } else {
                res.status(400).json("Invalid Password")
            }
        } else {
            res.status(400).json("No user found")
        }

    } catch (error) {
        res.status(500).json("Server Error")
        console.log(error);
    }
})


module.exports = router;