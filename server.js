const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const Room = require("./models/rooms");
const User = require("./models/user");
const {MONGODB_URI} = require("./keys");
const {v4 : uuidv4} = require("uuid");

io.on("connection", async (socket) => {
    console.log(socket.id);


    socket.on("ROOM:CREATE", async () => {
        try{
            const room = new Room({users: [{id: socket.id}], code: ""});
            await room.save();
            socket.join(room._id);
            io.to(socket.id).emit("ROOM:CREATED", {roomId: room._id, code: room.code});
        }catch (e) {
            console.log(e);
        }
    })

    socket.on("ROOM:JOIN", async ({roomId}) => {
        try {
            const room = await Room.findOne({_id: roomId});
            if(room){
                room.users = [...room.users, socket.id];
                await room.save();
                socket.join(roomId);
                io.to(socket.id).emit("USER:JOINED", {users: room.users, code: room.code})
            }else {
                io.to(socket.id).emit("JOIN:FAILED");
            }
        }catch (e) {
            console.log(e);
        }
    })

    socket.on("disconnect", async () => {
        try {
            const user = await User.findOne({socketId: socket.id});
            async function deleteUser(room) {
                try {
                    const room = await Room.findOne({_id: room.id});
                    room.users = room.users.filter(item => item !== socket.id);
                    await room.save();
                }catch (e) {
                    console.log(e);
                }
            }
            if(user){
                user.rooms.forEach(room => {
                    deleteUser(room);
                })
            }
        }catch (e) {
            console.log(e);
        }
    })
})

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
