import React, {useState, useEffect} from 'react';
import "./app.scss";
import Editor from "../editor/editor";
import Console from "../console/console";
import socket from "../../socket";
import Popup from "../popup/popup";

const App = () => {
    const [code, setCode] = useState("");
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        setCode("console.log(`Hello world!`)");
    }, []);

    const onCodeChange = (input) => {
        setCode(input);
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
                <span className="status">Current mode: Offline</span>
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