import React, { useState, useRef, useContext, useEffect } from "react";

import MessageInput from "./MessageInput";
import Message from "./Message";
import AwaitingMessage from "./AwaitingMessage";
import "./Chat.css";
import CurrentWeather from "./CurrentWeather";
import ColorContext from "../States/color-context";

import { auth, firestore } from "../FirebaseSetup/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { WeatherType } from "../Enums/WeatherType";
import { WeekDay } from "../Enums/WeekDay";
import CoordinatesContext from "../States/coordinates-context";
import MobileContext from "../States/mobile-context";

const Chat = (props: {
  id: any;
  messages: any[] | undefined;
  docID?: any;
  setLocalStorageData: (arg0: any) => void;
}) => {
  const toScroll = useRef<HTMLSpanElement>(null);

  const mobileContext = useContext(MobileContext);

  const [user] = useAuthState(auth);

  useEffect(() => {
    let docRef = doc(
      firestore,
      "data_collection",
      "data",
      "users",
      user ? user!.uid : "cPWUPEJlgUiW8hj8vGag", // user id
      "chats",
      props.docID[props.id] ? props.docID[props.id]! : "WZ6qCAbSgvdArd1o0eq6" // chat id to be passed as props
    );
    setDocRef(docRef);
  }, [props.docID, user]);

  const [docRef, setDocRef] = useState(
    doc(
      firestore,
      "data_collection",
      "data",
      "users",
      user ? user!.uid : "cPWUPEJlgUiW8hj8vGag", // user id
      "chats",
      props.docID[props.id] ? props.docID[props.id]! : "WZ6qCAbSgvdArd1o0eq6" // chat id to be passed as props
    )
  );

  const [awaitingMessage, setAwaitingMessage] = useState("hidden");
  const [responseReceived, setResponseReceived] = useState(true);

  // states lifted up from MessageInput
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("#999999");

  const colorContext = useContext(ColorContext);
  const coordinatesContext = useContext(CoordinatesContext);

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
    if (message.length === 0) return;
    if (user) {
      updateDoc(docRef, {
        messages: arrayUnion({
          text: message,
          type: "message",
          isUser: true,
          id: Date.now(),
        }),
      });
    } else {
      const items = JSON.parse(localStorage.getItem("chats")!);
      items[props.id].messages.push({
        text: message,
        type: "message",
        isUser: true,
        id: Date.now(),
      });
      localStorage.setItem("chats", JSON.stringify(items));
      props.setLocalStorageData(items);
    }

    setMessage("");
    setButtonColor("#999999");
    setAwaitingMessage("hidden");
    if (toScroll.current != null)
      toScroll.current.scrollIntoView({ behavior: "smooth" });
    fetch("http://127.0.0.1:8000/chatbot/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        lat: coordinatesContext.latitude,
        lon: coordinatesContext.longitude,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setResponseReceived(true);
        } else setResponseReceived(false);
        return response.json();
      })
      .then((data) => {
        if (responseReceived) {
          if (user) {
            if (data.response.type === "message") {
              updateDoc(docRef, {
                messages: arrayUnion({
                  text: data.response.text,
                  type: data.response.type,
                  isUser: false,
                  id: Date.now(),
                }),
              });
            } else {
              updateDoc(docRef, {
                messages: arrayUnion({
                  data: data.response.data,
                  type: data.response.type,
                  isUser: false,
                  id: Date.now(),
                  forecast: data.response.data.forecast,
                }),
              });
              updateDoc(docRef, {
                messages: arrayUnion({
                  text: data.response.data.text,
                  type: 'message',
                  isUser: false,
                  id: Date.now(),
                }),
              });
            }
          } else {
            if (data.response.type === "message") {
              const items = JSON.parse(localStorage.getItem("chats")!);
              items[props.id].messages.push({
                text: data.response.text,
                type: data.response.type,
                isUser: false,
                id: Date.now(),
              });
              localStorage.setItem("chats", JSON.stringify(items));
              props.setLocalStorageData(items);
            } else {
              const items = JSON.parse(localStorage.getItem("chats")!);
              items[props.id].messages.push({
                data: data.response.data,
                type: data.response.type,
                isUser: false,
                id: Date.now(),
                forecast: data.response.data.forecast,
              });
              items[props.id].messages.push({
                text: data.response.data.text,
                type: 'message',
                isUser: false,
                id: Date.now()
              })
              localStorage.setItem("chats", JSON.stringify(items));
              props.setLocalStorageData(items);
            }
          }
        }
      });
  };

  return (
    <div className="chat-container">
      <div className={mobileContext.isMobile ? "chat-message-container-padding-mobile" : "chat-message-container-padding-desktop"}>
        <div className="chat-message-container">
          {!user
            ? props.messages!.map((message, index) => {
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
                      forecast={message.data.forecast}
                      weather={message.data.weather}
                      temperature={message.data.temperature}
                      city={message.data.city}
                      region={message.data.region}
                      day={message.data.day}
                      forecastDay={message.data.forecastDay}
                      forecastHour={message.data.forecastHour}
                    />
                  );
                }
              })
            : null}
          {user &&
          props.messages !== undefined &&
          props.messages[props.id] !== undefined
            ? props.messages[props.id].messages.map(
                (message: any, index: React.Key | null | undefined) => {
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
                        forecast={message.data.forecast}
                        weather={message.data.weather}
                        temperature={message.data.temperature}
                        city={message.data.city}
                        region={message.data.region}
                        day={message.data.day}
                        forecastDay={message.data.forecastDay}
                        forecastHour={message.data.forecastHour}
                      />
                    );
                  }
                }
              )
            : null}
          <AwaitingMessage isUser={true} visible={awaitingMessage} />
          <span ref={toScroll}></span>{" "}
          {/* this is for scrolling to the bottom of the chat, needs some tweaking TODO*/}
        </div>
      </div>
      <div className="chat-wrapper">
        <MessageInput
          message={message}
          textareaHandler={textareaHandler}
          sendMessage={sendMessage}
          buttonColor={buttonColor}
          enterPress={enterPress}
        />
      </div>
    </div>
  );
};

export default Chat;
