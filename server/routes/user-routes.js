const router = require("express").Router()
const User = require("../models/user-model")
const Gen = require("../models/gen-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



router.post("/signup", async (req, res) => {

    try {

        const checkExistingByEmail = await User.find({ email: req.body.email })
        const checkExistingByUsername = await User.find({ username: req.body.username })
        // const checkExistingByPhone = await User.find({ phone: req.body.phone })

        if (checkExistingByEmail.length || checkExistingByUsername.length) {
            return res.status(400).json(`User With this ${req.body.email} email already exists`)
        }


        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        req.body.password = hashedPassword

        const newUser = await User(req.body)

        await newUser.save()

        const createRoom = await Gen({roomId: req.body.username})

        await createRoom.save()

        newUser.password = null;

        res.json(newUser)
        
    } catch (error) {
        //console.log(error);
    }
})

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        console.log(email,password);
        const getUserbyMail = await User.find({ email: email })
        // const getUserbyPhone = await User.find({ phone: email })

        const user = getUserbyMail[0]

        if (getUserbyMail.length) {
            const hashedPassword = getUserbyMail[0].password
            const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
            //console.log(isPasswordCorrect);
            if (isPasswordCorrect) {
                const user_id = getUserbyMail[0]._id
                const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET)
                res.status(200).json({ user: user.email, token })
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

router.get("/search/:username", async (req, res) => {
    try {
        const { username } = req.params;

        const foundUsers = await User.find({ username: { $regex: new RegExp(username, "i") } })
            .select('email _id'); 

        if (foundUsers.length > 0) {
            res.status(200).json(foundUsers);
        } else {
            res.status(404).json("No users found");
        }
    } catch (error) {
        res.status(500).json("Server Error");
        console.log(error);
    }
});


module.exports = router;