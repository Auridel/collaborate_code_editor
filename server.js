const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const Room = require("./models/rooms");
const User = require("./models/user");
const {MONGODB_URI} = require("./keys");

io.on("connection", (socket) => {


    socket.on("ROOM:CREATE", async () => {
        try{
            const room = new Room({users: [socket.id]});
            let user = await User.findOne({socketId: socket.id});
            if(!user){
                user = new User({socketId: socket.id, rooms: room._id});
            }else {
                user.rooms = [...user.rooms, room._id];
            }
            await user.save();
            await room.save();
            socket.join(room._id.toString());
            io.to(socket.id).emit("ROOM:CREATED", {roomId: room._id});
        }catch (e) {
            console.log(e);
        }
    })

    socket.on("ROOM:JOIN", async ({roomId}) => {
        try {
            const room = await Room.findById(new mongoose.Types.ObjectId(roomId));
            if(room){
                room.users = [...room.users, socket.id];
                let user = await User.findOne({socketId: socket.id});
                if(!user){
                    user = new User({socketId: socket.id, rooms: [new mongoose.Types.ObjectId(roomId)]});
                }else {
                    user.rooms = [...user.rooms, roomId];
                }
                await user.save();
                await room.save();
                socket.join(roomId);
                io.to(socket.id).emit("JOIN:SUCCESS", {roomId, code: room.code});
                socket.to(roomId).broadcast.emit("USER:JOINED");
            }else {
                io.to(socket.id).emit("JOIN:FAILED");
            }
        }catch (e) {
            console.log(e);
        }
    })

    socket.on("CODE:UPDATE", async ({roomId, code}) => {
        await Room.findOneAndUpdate({_id: new mongoose.Types.ObjectId(roomId)}, {code: code});
        socket.to(roomId).broadcast.emit("CODE:NEW", {code});
    })

    socket.on("disconnect", async () => {
        try {
            const user = await User.findOne({socketId: socket.id});
            async function deleteUser(roomData) {
                try {
                    const room = await Room.findById(new mongoose.Types.ObjectId(roomData.id));
                    if(room){
                        room.users = room.users.filter(item => item !== socket.id);
                        if(!room.users.length) await Room.deleteOne({_id: new mongoose.Types.ObjectId(roomData.id)});
                        else await room.save();
                    }
                }catch (e) {
                    console.log(e);
                }
            }
            if(user){
                user.rooms.forEach(room => {
                    deleteUser(room);
                })
                await User.deleteOne({socketId: socket.id});
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
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        server.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}...`);
        })
    }catch (e) {
        console.log(e);
    }
}

start();
