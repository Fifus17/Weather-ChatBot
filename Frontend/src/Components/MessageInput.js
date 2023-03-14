import React, { useState } from 'react';

import './MessageInput.css';

// TODO add changing the border on blue when the textarea is clicked
const MessageInput = () => {

    const [message, setMessage] = useState('');
    const [buttonColor, setButtonColor] = useState('#999999');
    const [borderColor, setBorderColor] = useState('1px solid transparent');

    const textareaHandler = (event) => {
        setMessage(event.target.value);
        if (event.target.value.length > 0) setButtonColor('#2563eb');
        else setButtonColor('#999999');
    }

    const textareaBorderOn = (event) => {
        setBorderColor('1px solid #2563eb');
    }

    const textareaBorderOff = (event) => {
        setBorderColor('1px solid transparent');
    }

    const sendMessage = () => {
        setMessage('');
        setButtonColor('#999999')
    }

    return (
        <div className="message-input-container">
            <div className="message-input-wrapper">
                <textarea className='message-input-textarea' type="text" value={message} placeholder="Send message" style={{border: borderColor}} onChange={textareaHandler} onFocus={textareaBorderOn} onBlur={textareaBorderOff}/>
                <button className="message-input-send-button" onClick={sendMessage}><svg xmlns="http://www.w3.org/2000/svg" overflow="visible" preserveAspectRatio="none" viewBox="0 0 24 24" width="20" height="20"><path fill={buttonColor} d="M2 21l21-9L2 3v7l15 2-15 2z"></path></svg></button>
            </div>
        </div>
    );
}

export default MessageInput;