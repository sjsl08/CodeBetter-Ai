const router = require("express").Router()
const Gen = require("../models/gen-model")

router.post("/",async(req,res)=>{
    try {
        if(req.body.prompt && req.body.response){
            const data = await Gen(req.body)
            await data.save() 
            res.status(200)
        }
        return res.status(400).json({error:"no data to be saved"})
    } catch (error) {
        res.send(500).json({error:"something went wrong"})
    }
})

module.exports = router;