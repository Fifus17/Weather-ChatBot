import React, { useContext, useState } from "react";
import ColorContext from "../States/color-context";

import "./MessageInput.css";

const MessageInput = (props: {
  message: string | number | readonly string[] | undefined;
  textareaHandler: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  enterPress: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  sendMessage: React.MouseEventHandler<HTMLButtonElement> | undefined;
  buttonColor: string | undefined;
}) => {
  const [borderColor, setBorderColor] = useState("1px solid transparent");

  const colorContext = useContext(ColorContext);

  const textareaBorderOn = (event: any) => {
    setBorderColor(`1px solid ${colorContext.color}`);
  };

  const textareaBorderOff = (event: any) => {
    setBorderColor("1px solid transparent");
  };

  return (
    <div className="message-input-container-background">
      <div className="message-input-container">
        <div className="message-input-wrapper">
          <textarea
            className="message-input-textarea"
            value={props.message}
            placeholder="Send message"
            style={{ border: borderColor }}
            onChange={props.textareaHandler}
            onKeyDown={props.enterPress}
            onFocus={textareaBorderOn}
            onBlur={textareaBorderOff}
          />
          <button
            className="message-input-send-button"
            onClick={props.sendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              overflow="visible"
              preserveAspectRatio="none"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill={props.buttonColor}
                d="M2 21l21-9L2 3v7l15 2-15 2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
