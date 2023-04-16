import React, { useState, useRef, useContext } from "react";

import MessageInput from "./MessageInput";
import Message from "./Message";
import AwaitingMessage from "./AwaitingMessage";
import "./Chat.css";
import CurrentWeather from "./CurrentWeather";
import ColorContext from "../States/color-context";

import { auth, firestore } from "../FirebaseSetup/firebase";
import { arrayUnion, doc, FieldValue, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

const Chat = (props: {
  setChats: (arg0: (prevState: any) => any) => void;
  id: any;
  messages: any[] | undefined;
  docID?: any;
  setLocalStorageData: (arg0: any) => void;
}) => {
  // const toScroll = useRef();
  const toScroll = useRef<HTMLSpanElement>(null);

  const [user] = useAuthState(auth);

  let docRef = doc(
    firestore,
    "data_collection",
    "data",
    "users",
    user ? user!.uid : "cPWUPEJlgUiW8hj8vGag", // user id
    "chats",
    props.docID ? props.docID! : "WZ6qCAbSgvdArd1o0eq6" // chat id to be passed as props
  );
  

  // const [messages, messagesLoading, messagesError] = useDocumentData(docRef);

  // console.log(props.messages);

  const [awaitingMessage, setAwaitingMessage] = useState("hidden");

  // states lifted up from MessageInput
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("#999999");

  const colorContext = useContext(ColorContext);

  const textareaHandler = (event: any) => {
    setMessage(event.target.value);
    if (event.target.value.length > 0) {
      setButtonColor(colorContext.color);
      setAwaitingMessage("visible");
    } else {
      setButtonColor("#999999");
      setAwaitingMessage("hidden");
    }
  };

  const enterPress = (e: {
    keyCode: number;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    // I need to make this change the state of all messages held in layout component
    if (message.length === 0) return;
    if(user) updateDoc(docRef, { messages: arrayUnion({text: message, type: 'message', isUser: true, id: Date.now()}) });
    else {
      const items = JSON.parse(localStorage.getItem("chats")!);
      items[props.id].messages.push({text: message, type: 'message', isUser: true, id: Date.now()});
      localStorage.setItem("chats", JSON.stringify(items));
      props.setLocalStorageData(items);
    }
    
    setMessage("");
    setButtonColor("#999999");
    setAwaitingMessage("hidden");
    if (toScroll.current != null)
      toScroll.current.scrollIntoView({ behavior: "smooth" });
  };
  // end of states lifted up from MessageInput

  return (
    // <ColorContext.Provider value={{ color:  }}>
    <div className="chat-container">
      <div className="chat-message-container-padding">
        <div className="chat-message-container">
          {/* indexes will be replaced by id from database */}
          {props.messages! && props.messages.length > 0 ? props.messages!.map((message, index) => {
            if (message.type === "message") {
              return (
                <Message
                  key={index}
                  text={message.text}
                  isUser={message.isUser}
                />
              );
            } else if (message.type === "currentWeather") {
              return (
                <CurrentWeather
                  key={index}
                  weather={message.weather}
                  temperature={message.temperature}
                  uv={message.uv}
                  wind={message.wind}
                  city={message.city}
                  region={message.region}
                  day={message.day}
                  forecastDay={message.forecastDay}
                  forecastHour={message.forecastHour}
                />
              );
            }
          }) : null}
          <AwaitingMessage isUser={false} visible={awaitingMessage} />
          <span ref={toScroll}></span>{" "}
          {/* this is for scrolling to the bottom of the chat, needs some tweaking TODO*/}
        </div>
      </div>
      <div className="chat-wrapper">
        <MessageInput
          // className="chat-message-input"
          message={message}
          textareaHandler={textareaHandler}
          sendMessage={sendMessage}
          buttonColor={buttonColor}
          enterPress={enterPress}
        />
      </div>
    </div>
    // </ColorContext.Provider>
  );
};

export default Chat;
