import "./App.css";
import Chat from "./Components/Chat";
import MessageInput from "./Components/MessageInput";
import Layout from "./Components/Layout";
import { ThemingProvider } from "@zendeskgarden/react-theming";
import React, { Component }  from 'react';

function App() {
  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
