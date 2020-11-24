import React, {useState, useEffect} from 'react';
import "./app.scss";
import Editor from "../editor/editor";
import Console from "../console/console";
import socket from "../../socket";
import Popup from "../popup/popup";

const App = () => {
    const [code, setCode] = useState("");
    const [popup, setPopup] = useState(false);
    const [room, setRoom] = useState("");

    useEffect(() => {
        setCode("console.log(`Hello world!`)");
        socket.on("USER:JOINED", onJoin);
        socket.on("CODE:NEW", onNewCode);
        socket.on("ROOM:CREATED", onCreate);
        socket.on("JOIN:SUCCESS", onSuccess);
        socket.on("JOIN:FAILED", () => console.log("fail"))
    }, []);

    const onJoin = () => {
        socket.emit("CODE:UPDATE", {roomId: room, code})
    }
    const onNewCode = ({code}) => {
        setCode(code);
    }
    const onCreate = ({roomId}) => {
        setRoom(roomId);
    }



    const onCodeChange = (input) => {
        setCode(input);
        if(room){
            socket.emit("CODE:UPDATE", {roomId: room, code})
        }
    }
    const onSuccess = ({roomId}) => {
        setRoom(roomId);
    }

    return (
        <div className="app">
            <h1 className="header">Collaborate Code Editor</h1>
            <nav className="nav">
                <button
                    onClick={() => {
                        socket.emit("ROOM:CREATE");
                    }}
                    className="nav-btn">Create new room</button>
                <span className="status">{room? `RoomID: ${room}` : "Current mode: Offline"}</span>
                <button
                    onClick={() => {
                        setPopup(true);
                    }}
                    className="nav-btn">Connect to room</button>
            </nav>
            <Editor value={code} onCodeChange={onCodeChange}/>
            <Console code={code}/>
            {popup? <Popup trigger={setPopup}/> : ""}
        </div>
    );
};

export default App;