import "./App.css";
import Chat from "./Components/Chat";
import MessageInput from "./Components/MessageInput";
import Layout from "./Components/Layout";
import { PALETTE, ThemeProvider } from "@zendeskgarden/react-theming";
import React, { Component, useState } from "react";
import { matrix } from "./Components/SettingsColorSwatch";
import ColorContext from "./States/color-context";

import "firebase/firestore";
import firebase, { initializeApp } from "firebase/app";
import { useAuthState, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "./FirebaseSetup/firebase";
import {
  collection,
  CollectionReference,
  DocumentData,
  orderBy,
  query,
} from "firebase/firestore";
import UserChatsContext from "./States/user-chats-context";

function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyCWU5mfJAg37GBY961hkCGrmmAUORJmqnw",
    authDomain: "weather-chatbot-232b8.firebaseapp.com",
    projectId: "weather-chatbot-232b8",
    storageBucket: "weather-chatbot-232b8.appspot.com",
    messagingSenderId: "441816577712",
    appId: "1:441816577712:web:58487dd5c177f039752d75",
    measurementId: "G-J3HNL8982M"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const [selectedRowIndex, setSelectedRowIndex] = useState(3);
  const [selectedColIndex, setSelectedColIndex] = useState(1);
  const [currentColor, setCurrentColor] = useState(PALETTE.green[400]);
  const [currentColorName, setCurrentColorName] = useState("Green-400");

  const onChange = (rowIdx: number, colIdx: number) => {
    setCurrentColor(matrix[rowIdx][colIdx].value);
    setCurrentColorName(matrix[rowIdx][colIdx].label);
  };
  const onSelect = (rowIdx: number, colIdx: number) => {
    setSelectedRowIndex(rowIdx);
    setSelectedColIndex(colIdx);
  };

  const messagesRef: CollectionReference<DocumentData> = collection(
    firestore,
    "data_collection",
    "data",
    "users",
    "cPWUPEJlgUiW8hj8vGag", // user id
    "chats"
  );

  console.log(messagesRef);

  // const messagesQuery = query(messagesRef, orderBy("date"));

  const [messages, messagesLoading, messagesError] = useCollectionData(messagesRef);

  return (
    <div className="App">
      <UserChatsContext.Provider
        value={{
          userChats: messages,
          [Symbol.iterator]: function* () {
            if (messages !== undefined) {
              for (const chat of messages) {
                yield messages;
              }
            }
            else {
              yield [{messages: []}];
            }
          },
        }}
      >
        <ColorContext.Provider
          value={{
            color: currentColor,
            name: currentColorName,
            row: selectedRowIndex,
            col: selectedColIndex,
            onChange: onChange,
            onSelect: onSelect,
          }}
        >
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </ColorContext.Provider>
      </UserChatsContext.Provider>
    </div>
  );
}

export default App;
