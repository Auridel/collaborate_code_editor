const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const {MONGODB_URI} = require("./keys");

const PORT = process.env.PORT || 4000;

async function start() {
    try{
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        server.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}...`);
        })
    }catch (e) {
        console.log(e);
    }
}

start();
