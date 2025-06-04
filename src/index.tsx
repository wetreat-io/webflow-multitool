import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import ReplaceLorem from "./replaceLorem";
import RewritePage from "./rewritePage";
import RewriteSelection from "./rewriteSelection";

const App: React.FC = () => {
  
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [action, setAction] = useState("ReplaceLorem");
  const [userPrompt, setUserPrompt] = useState("");
  
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
      await RewriteSelection(apiKey,userPrompt,setStatusMessage);
    }
  };

  return (<div id="app-wrapper">

    {statusMessage !== "" && <div id="status-message">{statusMessage}</div>}
  
    <label>ChatGPT API Key</label>
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
  
  </div>);
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
