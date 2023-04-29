import { PALETTE } from "@zendeskgarden/react-theming";
import "./Message.css";
import React, { useContext } from "react";
import ColorContext from "../States/color-context";
import MobileContext from "../States/mobile-context";

const Message = (props: {
  isUser: any;
  text: string;
}) => {
  // need some state to keep track of message alignment (user right, bot left)
  // need some variable to keep track who sent the message that implies the alignment and colors

  let colorText = "black";
  let colorBackground = "white";

  const colorContext = useContext(ColorContext);

  const mobileContext = useContext(MobileContext);

  if (props.isUser) {
    colorText = "white";
    colorBackground = colorContext.color;
    // "#2563eb"
  }

  return (
    <div
      className={props.isUser ? "message-wrapper-is-user" : "message-wrapper"}
    >
      <div
        className="message-text-wrapper"
        style={mobileContext.isMobile ? { backgroundColor: colorBackground, padding: '5px 10px', maxWidth: '80%', borderRadius: '15px'} : {backgroundColor: colorBackground, padding: '10px 15px', maxWidth: '60%', borderRadius: '20px'}}
      >
        <p className="message-text" style={mobileContext.isMobile ? { color: colorText, fontSize: '8px'} : { color: colorText }}>
          {props.text}
        </p>
      </div>
    </div>
  );
};

export default Message;
