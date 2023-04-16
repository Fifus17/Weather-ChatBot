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
import { app, auth, firestore } from "./FirebaseSetup/firebase";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  DocumentReference,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
// import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import UserChatsContext from "./States/user-chats-context";
import { getAuth } from "firebase/auth";
import { UserContext } from "./States/user-context";

function App() {
  // Initialize Firebase states
  const [user] = useAuthState(auth);
  const [collectionRef, setCollectionRef] = useState<
    CollectionReference<DocumentData>
  >(
    collection(
      firestore,
      "data_collection",
      "data",
      "users",
      "cPWUPEJlgUiW8hj8vGag",
      "chats"
    )
  );
  const [localStorageData, setLocalStorageData] = useState([{messages: []}]);
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      var messagesRef = collection(
        firestore,
        "data_collection",
        "data",
        "users",
        user!.uid, // user id z context'u
        "chats"
      );
    } else {
      var messagesRef = collection(
        firestore,
        "data_collection",
        "data",
        "users",
        "cPWUPEJlgUiW8hj8vGag",
        "chats"
      );

      let items = JSON.parse(localStorage.getItem("chats")!);
      if (items !== undefined && items !== null) {
        setLocalStorageData(items);
      } else {
        localStorage.setItem(
          "chats",
          JSON.stringify([
            {
              date: new Date(),
              messages: [{ text: "bagno", isUser: true, type: "message" }],
            },
          ])
        );
        let items = JSON.parse(localStorage.getItem("chats")!);
        setLocalStorageData(items);
      }
    }
    setCollectionRef(messagesRef);
  }, [user]);

  // const [messages, messagesLoading, messagesError] = useCollectionData(query(collectionRef!, orderBy("date")));
  // let messages: DocumentData[] | undefined;
  // let messagesLoading: boolean;
  // let messagesError: Error | undefined;
  let [messages, messagesLoading, messagesError] = useCollectionData(
    query(collectionRef!, orderBy("date"))
  );

  // Choosing global color state in Settings View (Color Swatch)
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

  const newChat = () => {
    if (user) addDoc(collectionRef!, { date: serverTimestamp(), messages: [] });
    else {
      const items = JSON.parse(localStorage.getItem("chats")!);
      items.push({
        date: new Date(),
        messages: [{ text: "bagno", isUser: true, type: "message" }],
      });
      localStorage.setItem("chats", JSON.stringify(items));
      setLocalStorageData(items);
    }
  };

  return (
    <div className="App">
      <UserContext.Provider value={{ user: user }}>
        <UserChatsContext.Provider
          value={{
            chatsCollectionRef: collectionRef!,
            userChats: user ? messages : localStorageData,
            [Symbol.iterator]: function* () {
              if (user) {
                if (messages !== undefined) {
                  for (const chat of messages) {
                    yield messages;
                  }
                } else {
                  yield [{ messages: [] }];
                }
              } else {
                if (localStorageData !== undefined) {
                  for (const chat of localStorageData) {
                    yield localStorageData;
                  }
                } else {
                  yield [{ messages: [] }];
                }
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
              <Layout
                addChat={newChat}
                localStorageData={localStorageData}
                setLocalStorageData={setLocalStorageData}
                messages={messages}
              />
            </ThemeProvider>
          </ColorContext.Provider>
        </UserChatsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
