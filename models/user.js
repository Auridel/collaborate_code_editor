const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    socketId: {
        type: String,
        required: true
    },
    rooms: [{
        id: {
            type: String,
            required: true
        }
    }]
});

module.exports = model("User", userSchema);