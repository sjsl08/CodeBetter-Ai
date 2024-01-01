const router = require("express").Router()
const ChatMessage = require("../models/ChatMessage.js");


router.post("/newMessage", async (req, res) => {
  const newMessage = new ChatMessage(req.body);

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
})

router.get("/room/:chatRoomId", async (req, res) => {
    try {
      const messages = await ChatMessage.find({
        chatRoomId: req.params.chatRoomId,
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(409).json({
        message: error.message,
      });
    }
  }
);

const ChatRoom = require("../models/ChatRoom.js");


router.post("/",  async (req, res) => {
  console.log(req.body);
  const newChatRoom = new ChatRoom({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    await newChatRoom.save();
    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});


module.exports = router
