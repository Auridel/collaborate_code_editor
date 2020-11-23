const {Schema, model} = require("mongoose");

const roomsSchema = new Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    users: [{
        id: {
            type: String,
            required: true
        }
    }],
    code: {
        type: String
    }
})

module.exports = model("Rooms", roomsSchema);