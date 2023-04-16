import "./App.css";
import Layout from "./Components/Layout";
import { PALETTE, ThemeProvider } from "@zendeskgarden/react-theming";
import React, { useEffect, useState } from "react";
import { matrix } from "./Components/SettingsColorSwatch";
import ColorContext from "./States/color-context";

import "firebase/firestore";
import {
  useAuthState,
} from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "./FirebaseSetup/firebase";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  orderBy,
  Query,
  query,
  serverTimestamp,
} from "firebase/firestore";
import UserChatsContext from "./States/user-chats-context";
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
      "6pOjJIpLpLLcN3dbhVwE",
      "chats"
    )
  );
  const [documentsIDS, setDocumentsIDS] = useState<string[]>([]);
  const [localStorageData, setLocalStorageData] = useState([{ messages: [] }]);

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
      console.log("user is logged in");
      getDocumentsIDS(messagesRef).then((data) => {setDocumentsIDS(data);});
    } else {
      // eslint-disable-next-line
      var messagesRef = collection(
        firestore,
        "data_collection",
        "data",
        "users",
        "6pOjJIpLpLLcN3dbhVwE",
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
              messages: [
                {
                  text: "Hello, my name is Stormy and I can be your weather forecasting friend! Just ask me about a date and place you are interested in and I will fetch needed data for you. If you are interested in the project, feel free to ask me about the authors or details.",
                  isUser: false,
                  type: "message",
                },
              ],
            },
          ])
        );
        let items = JSON.parse(localStorage.getItem("chats")!);
        setLocalStorageData(items);
      }
    }
    setCollectionRef(messagesRef);
  }, [user]);

  // eslint-disable-next-line
  let [messages, messagesLoading, messagesError] = useCollectionData(
    query(collectionRef!, orderBy("date"))
  );

  const getDocumentsIDS = async (collectionRef: Query<unknown>) => {
    const collectionSnapshot = await getDocs(query(collectionRef!, orderBy("date")));
    const collectionData = collectionSnapshot.docs.map((doc) => doc.id);
    return collectionData;
  };

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

  const newChat = async () => {
    if (user) {
      addDoc(collectionRef!, { date: serverTimestamp(), messages: [] });
      setDocumentsIDS(await getDocumentsIDS(collectionRef!));
    }
    else {
      const items = JSON.parse(localStorage.getItem("chats")!);
      items.push({
        date: new Date(),
        messages: [],
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
                  // eslint-disable-next-line
                  for (const chat of messages) {
                    yield messages;
                  }
                } else {
                  yield [{ messages: [] }];
                }
          
            }},
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
                ids={documentsIDS}
              />
            </ThemeProvider>
          </ColorContext.Provider>
        </UserChatsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
