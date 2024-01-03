const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const server = http.createServer(app);
const { exec } = require('child_process');
require("dotenv").config()

const Gen = require("./models/gen-model")

const { GoogleGenerativeAI } = require("@google/generative-ai");
const connect_database = require('./utils/connect');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// Use cors middleware to allow requests from all origins for HTTP requests
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/user', require('./routes/user-routes'))
app.use('/save-prompt', require('./routes/gen-routes'))
app.use('/chat', require('./routes/Messages-Routes'))

app.get("/test", (req, res) => {
    res.json("hello")
})




app.post("/generate", async (req, res) => {

    const { input, roomId } = req.body;

    console.log(input);

    if (!input) {
        return res.status(400).json({ error: "Input text is required." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContentStream(input);
        //   io.emit('response', 'Generating...'); // Notify client that generation is in progress
        const response = (await result.response).text()
        // console.log("-----------------------------------",response,"-----------------------------");

        for await (let chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            // io.emit('response', chunkText); // Emit each chunk text to the client
        }
        if (roomId && input && response) {
            const existingData = await Gen.findOne({ roomId });

            if (existingData) {
                // console.log({ input, response });
                // If the room already exists, push the new data to the array
                existingData.data.push({ prompt: input, response });
                await existingData.save();
            } else {
                // If the room doesn't exist, create a new document
                const newData = new Gen({
                    roomId,
                    data: [{ prompt: input, response }],
                });
                await newData.save();
            }
        }



        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
        // const response = (await error.response).text()
        res.status(500).json({ msg: "ERROR" });
    }
})


app.post('/run-code', async (req, res) => {
    const { language, code } = req.body;


    // console.log(code);
    // console.log(code.join('\n'));
    code[0] = code[0].replace(/"/g, "'");



    let command = '';
    let image = '';

    // Determine the Docker image and command based on the language
    switch (language) {
        case 'python':
            image = 'python:latest';
            command = `echo "${code.join('\n')}" > /tmp/code.py && python3 /tmp/code.py`;
            break;
        case 'javascript':
            image = 'node:latest';
            command = `echo "${code.join('\n')}" > /tmp/code.js && node /tmp/code.js`;
            break;
        default:
            res.status(400).send('Unsupported language');
            return;
    }

    // Run code in a Docker container
    exec(`docker run --rm ${image} ${command}`, (error, stdout, stderr) => {
        if (error) {


            const regex = /> \/tmp\/code\.js && node \/tmp\/code\.js/g;
            const match = error.message.match(regex);

            if (match) {
                const extractedCommand = match[0];
                console.log(extractedCommand);
            } else {
                console.log('Command not found');
            }

            // console.error(`Error: ${error.message.split("Syntax error")}`);
            res.status(500).send(error.message);
            return;
        }
        if (stderr) {
            console.error(`Runtime Error: ${stderr}`);
            res.status(200).send(stderr);
            return;
        }
        console.log(`Output: ${stdout}`);
        res.status(200).send(stdout);
    });
});


const io = new Server(server, {
    cors: {
        origin: '*', // Consider specifying the actual origin of your frontend application
    },
});



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', async (roomId) => {

        if (roomId) {
            const existingData = await Gen.findOne({ roomId });

            if (!existingData) {
                const newData = new Gen({
                    roomId,
                    data: [],
                });
                await newData.save();
            }
            socket.join(roomId);


            const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
            console.log(`User joined room: ${roomId} ${roomSize}`);
        }
    });

    // Emit an event to a specific room
    socket.on('emitToRoom', (roomName, data, author,) => {

        const processedData = { isMyMessage: author, text: data, ppl: io.sockets.adapter.rooms.get(roomName)?.size || 0 }

        io.to(roomName).emit('testRoomEvent', processedData);
        console.log(`Data emitted to room ${roomName}:`, processedData);
    });

    socket.on('text-update', (updatedText) => {
        io.emit('text-update', updatedText);
    });

    socket.on('codeChange', ({ type, value, roomId, user }) => {
        // Broadcast the code change to all clients in the room
        console.log(user);
        socket.to(roomId).emit('codeChanged', { type, value, user });
    });
    socket.on('newMsgToServer', (msg) => {
        console.log(`msg from client ------------------------ ${msg}`);
        const data = { isMyMessage: msg.username, text: msg.userMsg }
        io.emit('newMsgToClient', data);
        io.to("test").emit(data)
    });

    socket.on('aiResponse', (updatedText) => {
        io.emit('response', updatedText);
    });

    socket.on('disconnecting', () => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
            if (room !== socket.id) {
                const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
                console.log(`Users in room ${room}: ${roomSize}`);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    await connect_database()
    console.log(`Server is running on port ${PORT}`);

});

