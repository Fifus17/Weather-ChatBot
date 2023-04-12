import "./App.css";
import Layout from "./Components/Layout";
import { PALETTE, ThemeProvider } from "@zendeskgarden/react-theming";
import React, { Component, useEffect, useState } from "react";
import { matrix } from "./Components/SettingsColorSwatch";
import ColorContext from "./States/color-context";

import "firebase/firestore";
import firebase, { initializeApp } from "firebase/app";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "./FirebaseSetup/firebase";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import UserChatsContext from "./States/user-chats-context";
import { getAuth } from "firebase/auth";
import { UserContext } from "./States/user-context";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCWU5mfJAg37GBY961hkCGrmmAUORJmqnw",
    authDomain: "weather-chatbot-232b8.firebaseapp.com",
    projectId: "weather-chatbot-232b8",
    storageBucket: "weather-chatbot-232b8.appspot.com",
    messagingSenderId: "441816577712",
    appId: "1:441816577712:web:58487dd5c177f039752d75",
    measurementId: "G-J3HNL8982M",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [user] = useAuthState(auth);

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

  const messagesRef = collection(
    firestore,
    "data_collection",
    "data",
    "users",
    "cPWUPEJlgUiW8hj8vGag", // user id z context'u
    "chats"
  );

  const sortedQuery = query(messagesRef, orderBy("date"));

  const [messages, messagesLoading, messagesError] =
    useCollectionData(sortedQuery);

  const getDocumentIds = async () => {
    // try {
    //   const querySnapshot = await messagesRef.get();
    //   const ids: any[] = [];
    //   querySnapshot.forEach((doc: { id: any; }) => {
    //     ids.push(doc.id);
    //   });
    //   console.log(ids);
    // } catch (error) {
    //   console.log("Error getting documents: ", error);
    // }
  };

  getDocumentIds();

  const newChat = () => {
    addDoc(messagesRef, { date: serverTimestamp(), messages: [] });
  };

  return (
    <div className="App">
      <UserContext.Provider value={{ user: user }}>
        <UserChatsContext.Provider
          value={{
            chatsCollectionRef: messagesRef,
            userChats: messages,
            [Symbol.iterator]: function* () {
              if (messages !== undefined) {
                for (const chat of messages) {
                  yield messages;
                }
              } else {
                yield [{ messages: [] }];
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
              <Layout addChat={newChat} />
            </ThemeProvider>
          </ColorContext.Provider>
        </UserChatsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
