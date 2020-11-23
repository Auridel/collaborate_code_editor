import React, {useState} from 'react';
import ReactDOM from "react-dom";
import socket from "../../socket";

const Popup = ({trigger}) => {
    const [room, setRoom] = useState("");

    return ReactDOM.createPortal(
        <div className="popup">
            <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="room-input"
                type="text" placeholder="Enter room ID"/>
            <button
                onClick={() => {
                    socket.emit("ROOM:JOIN", {roomId: room});
                }}
                className="enter-btn">Enter Room</button>
            <button
                onClick={() => trigger(false)}
                className="close-btn"/>
        </div>,
    document.getElementById("portal"));
};

export default Popup;