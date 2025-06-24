import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import ReplaceLorem from "./replaceLorem";
import RewritePage from "./rewritePage";
import RewriteSelection from "./rewriteSelection";

const App: React.FC = () => {
  
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [action, setAction] = useState("ReplaceLorem");
  const [userPrompt, setUserPrompt] = useState("");
  const [modalOptions, _setModalOptions] = useState<React.ReactNode[]>([]);
  
  const [statusMessage, setStatusMessage] = useState("");

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    localStorage.setItem("apiKey", e.target.value);
  };

  const handleUserPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value);
  };

  const handleLaunch = async () => {

    console.log("Launching");

    if (action === "ReplaceLorem") {
      await ReplaceLorem(apiKey,userPrompt,setStatusMessage);
    } else if (action === "RewritePage") {
      await RewritePage(apiKey,userPrompt,setStatusMessage);
    } else if (action === "RewriteSelection") {
      await RewriteSelection(apiKey,userPrompt,setStatusMessage,setModalOptions);
    }
  };

  const setModalOptions = (options: string[], callback: (option: string) => void) => {

    const modalOptions = options.map((option) => (
        <div className="modal-option" onClick={() => {
        callback(option);
        _setModalOptions([]);
      }}>
        {option}
      </div> 
    ));

    _setModalOptions(modalOptions);
  };

  return (<div id="app-wrapper">

    {statusMessage !== "" && <div id="status-message">{statusMessage}</div>}
  
    <label>ChatGPT API Key asdf</label>
    <input type="text" placeholder="ChatGPT API Key" defaultValue={apiKey} onChange={handleApiKeyChange}/>
    
    <select defaultValue={action||"Select Action"} onChange={handleActionChange}>
      <option>Select Action</option>
      <option value="ReplaceLorem">Fill in Lorem Ipsum</option>
      <option value="RewritePage">Rewrite page</option>
      <option value="RewriteSelection">Rewrite selection</option>
    </select>

    <label>Enter Prompt</label>
    <textarea placeholder="Enter Prompt" className="flex-1" defaultValue={userPrompt} onChange={handleUserPromptChange}></textarea>

    <button onClick={handleLaunch}>Launch 🚀</button>

    {modalOptions.length > 0 && <div id="modal">
      <div id="modal-content">
        {modalOptions}
        <button id="modal-cancel" onClick={() => _setModalOptions([])}>Cancel</button>
      </div>
    </div>}
  
  </div>);
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
