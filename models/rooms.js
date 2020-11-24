const {Schema, model} = require("mongoose");

const roomsSchema = new Schema({
    users: {
        type: Array,
        required: true
    },
    code: String
})

module.exports = model("Rooms", roomsSchema);