import React, {useEffect, useState} from 'react';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";

const Editor = ({value, onCodeChange}) => {
    const [size, setSize] = useState((window.innerHeight - 50) + "px");

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        return () => {
            window.removeEventListener("resize", resizeHandler);
        }
    })

    const resizeHandler = () => {
        setSize((window.innerHeight - 50) + "px");
    }

    return (
        <div className="editor" style={{height: size}}>
            <AceEditor
                placeholder="Enter your javascript code"
                mode="javascript"
                theme="tomorrow"
                name="code-editor"
                onChange={onCodeChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={value}
                style={{
                    width: "100%",
                    height: "100%"
                }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}/>
        </div>
    );
};

export default Editor;