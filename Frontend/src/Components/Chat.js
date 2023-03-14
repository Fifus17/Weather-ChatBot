import React, { useState, useRef } from "react";

import MessageInput from "./MessageInput";
import "./Chat.css"
import Message from "./Message";

const Chat = () => {

    const toScroll = useRef();

    // states lifted up from MessageInput
    const [message, setMessage] = useState('');
    const [buttonColor, setButtonColor] = useState('#999999');

    const textareaHandler = (event) => {
        setMessage(event.target.value);
        if (event.target.value.length > 0) setButtonColor('#2563eb');
        else setButtonColor('#999999');
    }

    const enterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          sendMessage();
        }}

    const sendMessage = () => {
        if (message.length === 0) return;
        setMessages([...messages, {text: message, isUser: true}]);
        setMessage('');
        setButtonColor('#999999');
        toScroll.current.scrollIntoView({ behavior: 'smooth' });
    }
    // end of states lifted up from MessageInput

    let [messages, setMessages] = useState([
        {
            text: "bagno bagno",
            isUser: false
        },{
            text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
            isUser: true
        }, {
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore omnis, quam voluptatum quaerat voluptatem libero voluptatibus officiis porro labore odit voluptas distinctio saepe nulla? Alias assumenda provident magni quam ratione.",
            isUser: false
        }, {
            text: "bagno bagno",
            isUser: false
        }]);

    return (
        <div className="chat-container">
            <div className="chat-message-container">
                {messages.map((message, index) => {
                return <Message key={index} text={message.text} isUser={message.isUser}/>
                })}
                <span ref={toScroll}></span>
            </div>
            <div className="chat-wrapper">
                <MessageInput 
                    className="chat-message-input" 
                    message={message} 
                    textareaHandler={textareaHandler} 
                    sendMessage={sendMessage} 
                    buttonColor={buttonColor} 
                    enterPress={enterPress}/>
            </div>
        </div>
    )
}

export default Chat;