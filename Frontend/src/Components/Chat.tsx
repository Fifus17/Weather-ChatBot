import React, { useState, useRef } from "react";

import MessageInput from "./MessageInput";
import Message from "./Message";
import AwaitingMessage from "./AwaitingMessage";
import "./Chat.css";
import CurrentWeather from "./CurrentWeather";

const Chat = (props: {
  appliedColor: string;
  setChats: (arg0: (prevState: any) => any) => void;
  id: any;
  messages: any[];
}) => {
  // const toScroll = useRef();
  const toScroll = useRef<HTMLSpanElement>(null);

  const [awaitingMessage, setAwaitingMessage] = useState("hidden");

  // states lifted up from MessageInput
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("#999999");

  const textareaHandler = (event: any) => {
    setMessage(event.target.value);
    if (event.target.value.length > 0) {
      setButtonColor(props.appliedColor);
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
    props.setChats((prevState) =>
      prevState.map((chat: any, index: any) =>
        index == props.id
          ? [...chat, { text: message, isUser: true, type: "message" }]
          : chat
      )
    );
    setMessage("");
    setButtonColor("#999999");
    setAwaitingMessage("hidden");
    console.log("before scroll");
    if (toScroll.current != null)
      toScroll.current.scrollIntoView({ behavior: "smooth" });
  };
  // end of states lifted up from MessageInput

  return (
    <div className="chat-container">
      <div className="chat-message-container-padding">
        <div className="chat-message-container">
          {/* indexes will be replaced by id from database */}
          {props.messages.map((message, index) => {
            if (message.type === "message") {
              return (
                <Message
                  key={index}
                  text={message.text}
                  isUser={message.isUser}
                  appliedColor={props.appliedColor}
                />
              );
            } else if (message.type === "currentWeather") {
              return (
                <CurrentWeather
                  weather={message.weather}
                  temperature={message.temperature}
                  uv={message.uv}
                  wind={message.wind}
                  city={message.city}
                  region={message.region}
                  day={message.day}
                  forecast={message.forecast}
                />
              );
            }
          })}
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
          appliedColor={props.appliedColor}
        />
      </div>
    </div>
  );
};

export default Chat;
