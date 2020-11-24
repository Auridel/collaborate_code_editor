const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    socketId: {
        type: String,
        required: true
    },
    rooms: {
        type: Array,
        required: true
    }
});

module.exports = model("User", userSchema);