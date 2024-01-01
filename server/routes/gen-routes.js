const router = require("express").Router();
const Gen = require("../models/gen-model");

// POST route to save data
router.post("/", async (req, res) => {
  try {
    const { roomId, prompt, response } = req.body;

    if (roomId && prompt && response) {
      const existingData = await Gen.findOne({ roomId });
      
      if (existingData) {
        console.log({prompt,response});
        // If the room already exists, push the new data to the array
        existingData.data.push({ prompt, response });
        await existingData.save();
      } else {
        // If the room doesn't exist, create a new document
        const newData = new Gen({
          roomId,
          data: [{ prompt, response }],
        });
        await newData.save();
      }

      return res.status(200).json({ message: "Data saved successfully" });
    }

    return res.status(400).json({ error: "Invalid data provided" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET route to retrieve all data
router.get("/", async (req, res) => {
  try {
    const allData = await Gen.find();
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET route to retrieve data by roomId
router.get("/byRoomId/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;

    if (!roomId) {
      return res.status(400).json({ error: "roomId parameter is required" });
    }

    const dataByRoomId = await Gen.findOne({ roomId });
    
    if (dataByRoomId) {
      console.log(dataByRoomId);
      res.status(200).json(dataByRoomId.data);
    } else {
      res.status(404).json({ error: "Data not found for the specified roomId" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
