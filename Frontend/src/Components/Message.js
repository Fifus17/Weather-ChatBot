import { PALETTE } from "@zendeskgarden/react-theming"
import "./Message.css";
import React from "react";

const Message = (props) => {

    // need some state to keep track of message alignment (user right, bot left)
    // need some variable to keep track who sent the message that implies the alignment and colors

    let colorText = "black";
    let colorBackground = "white";

    if(props.isUser){
        colorText = "white";
        colorBackground = props.appliedColor;
        // "#2563eb"
    }
    
    return(
        
        <div className={props.isUser ? "message-wrapper-is-user" : "message-wrapper"}>
            <div className="message-text-wrapper" style={{backgroundColor: colorBackground}}>
                <p className="message-text" style={{color: colorText}}>{props.text}</p>
            </div>
        </div>
    );
}

export default Message;