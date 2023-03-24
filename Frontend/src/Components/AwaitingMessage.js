import { Dots } from '@zendeskgarden/react-loaders';
import React from 'react';

import './AwaitingMessage.css';

const AwaitingMessage = (props) => {
    let colorText = "black";
    let colorBackground = "white";

    if(props.isUser){
        colorText = "white";
        colorBackground = "#2563eb";
    }
    
    return(
        <div className="awaiting-message-wrapper" style={{visibility: props.visible}}>
            <div className="awaiting-message-dots-wrapper" style={{backgroundColor: colorBackground}}>
                <Dots color={colorText}/>
            </div>
        </div>
    );
}

export default AwaitingMessage;