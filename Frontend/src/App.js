import "./App.css";
import Chat from "./Components/Chat";
import MessageInput from "./Components/MessageInput";
import Layout from "./Components/Layout";
import { ThemeProvider } from "@zendeskgarden/react-theming";
import React, { Component }  from 'react';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
       <Layout/>
      </ThemeProvider>
    </div>
  );
}

export default App;
