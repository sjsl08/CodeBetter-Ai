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
app.use('/user',require('./routes/user-routes'))
app.use('/save-prompt',require('./routes/gen-routes'))
app.use('/chat',require('./routes/Messages-Routes'))

app.get("/test", (req, res) => {
    res.json("hello")
  })
  

app.post("/generate", async (req, res) => {

    const { input } = req.body;
  
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

        // const toSaveResponse = await Gen({ prompt : input, response})
        
        // await toSaveResponse.save()

      for await (let chunk of result.stream) {
          const chunkText = chunk.text();
          console.log(chunkText);
          io.emit('response', chunkText); // Emit each chunk text to the client
      }
      return res.status(200)
      
    } catch (error) {
        console.log(error);
      res.status(500).json({ error });
    }
  })
  

app.post('/run-code', async (req, res) => {
    const { language, code } = req.body;


    console.log(code);
    console.log(code.join('\n'));


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
            console.error(`Error: ${error.message}`);
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

    socket.on('text-update', (updatedText) => {
        io.emit('text-update', updatedText);
    });

    socket.on('aiResponse', (updatedText) => {
        io.emit('response', updatedText);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async() => {
    await connect_database()
    console.log(`Server is running on port ${PORT}`);

});



// require("dotenv").config();
// const readline = require("readline");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// const userPrompt = new readline.createInterface({ input: process.stdin, output: process.stdout });

// userPrompt.prompt();

// userPrompt.on("line", async input => {

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContentStream(input);
//     for await(let chunk of result.stream) {
//         console.log(chunk.text());
//     }
//     // const response = await result.response;
//     // const text = response.text();
//     // console.log(text);
//     userPrompt.prompt();
// });



// 