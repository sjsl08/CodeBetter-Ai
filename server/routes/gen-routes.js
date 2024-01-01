const router = require("express").Router()
const Gen = require("../models/gen-model")

// POST route to save data
router.post("/", async (req, res) => {
    try {
        if (req.body.prompt && req.body.response) {
            const data = await Gen(req.body)
            await data.save()
            return res.status(200).json({ message: "Data saved successfully" });
        }
        return res.status(400).json({ error: "No data to be saved" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


router.get("/", async (req, res) => {
    try {
        const allData = await Gen.find();
        console.log(allData);
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
