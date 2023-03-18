import React, { useState } from "react";
import { PALETTE } from "@zendeskgarden/react-theming"

import "./MessageInput.css";

const MessageInput = (props) => {
  const [borderColor, setBorderColor] = useState("1px solid transparent");

  const textareaBorderOn = (event) => {
    setBorderColor(`1px solid ${props.appliedColor}`);
  };

  const textareaBorderOff = (event) => {
    setBorderColor("1px solid transparent");
  };

  return (
    <div className="message-input-container-background">
      <div className="message-input-container">
        <div className="message-input-wrapper">
          <textarea
            className="message-input-textarea"
            type="text"
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
