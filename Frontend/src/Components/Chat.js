import React, { useState, useRef } from "react";
import { PALETTE } from "@zendeskgarden/react-theming"

import MessageInput from "./MessageInput";
import Message from "./Message";
import AwaitingMessage from "./AwaitingMessage";
import "./Chat.css";

const Chat = (props) => {
  const toScroll = useRef();

  const [awaitingMessage, setAwaitingMessage] = useState("hidden");

  // states lifted up from MessageInput
  const [message, setMessage] = useState("");
  const [buttonColor, setButtonColor] = useState("#999999");

  const textareaHandler = (event) => {
    setMessage(event.target.value);
    if (event.target.value.length > 0) {
      setButtonColor(props.appliedColor);
      setAwaitingMessage("visible");
    } else {
      setButtonColor("#999999");
      setAwaitingMessage("hidden");
    }
  };

  const enterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.length === 0) return;
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage("");
    setButtonColor("#999999");
    setAwaitingMessage("hidden");
    toScroll.current.scrollIntoView({ behavior: "smooth" });
  };
  // end of states lifted up from MessageInput

  // local array of messages for testing purposes, later gonna be fetched from the server
  let [messages, setMessages] = useState([
    {
      text: "bagno bagno",
      isUser: false,
    },
    {
      text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
      isUser: true,
    },
    {
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore omnis, quam voluptatum quaerat voluptatem libero voluptatibus officiis porro labore odit voluptas distinctio saepe nulla? Alias assumenda provident magni quam ratione.",
      isUser: false,
    },
    {
      text: "bagno bagno",
      isUser: false,
    },
  ]);

  return (
    <div className="chat-container">
      <div className="chat-message-container-padding">
        <div className="chat-message-container">
          {/* indexes will be replaced by id from database */}
          {props.messages.map((message, index) => {
            return (
              <Message
                key={index}
                text={message.text}
                isUser={message.isUser}
                appliedColor={props.appliedColor}
              />
            );
          })}
          <AwaitingMessage isUser={false} visible={awaitingMessage} />
          <span ref={toScroll}></span>{" "}
          {/* this is for scrolling to the bottom of the chat, needs some tweaking TODO*/}
        </div>
      </div>
      <div className="chat-wrapper">
        <MessageInput
          className="chat-message-input"
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
