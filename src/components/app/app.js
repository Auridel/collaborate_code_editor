import React, {useState, useEffect} from 'react';
import "./app.scss";
import Editor from "../editor/editor";
import Console from "../console/console";

const App = () => {
    const [code, setCode] = useState("");

    useEffect(() => {
        setCode("console.log(`Hello world!`)");
    }, []);

    const onCodeChange = (input) => {
        setCode(input);
    }

    return (
        <div className="app">
            <h1 className="header">Live editor</h1>
            <Editor value={code} onCodeChange={onCodeChange}/>
            <Console code={code}/>
        </div>
    );
};

export default App;