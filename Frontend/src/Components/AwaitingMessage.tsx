import { Dots } from '@zendeskgarden/react-loaders';
import React, { useContext } from 'react';
import ColorContext from '../States/color-context';
import MobileContext from '../States/mobile-context';

import './AwaitingMessage.css';

const AwaitingMessage = (props: { isUser: any; visible: any; }) => {
    let colorText = "black";
    const colorContext = useContext(ColorContext);
    const mobileContext = useContext(MobileContext);


    if(props.isUser){
        colorText = "white";
    }
    
    return(
        <div className={props.isUser ? "awaiting-message-wrapper-is-user" : "awaiting-message-wrapper"} style={{visibility: props.visible}}>
            <div className="awaiting-message-dots-wrapper" style={mobileContext.isMobile ? {backgroundColor: colorContext.color, padding: '5px 10px', borderRadius: '15px', fontSize: '8px'} :{backgroundColor: colorContext.color}}>
                <Dots color={colorText}/>
            </div>
        </div>
    );
}

export default AwaitingMessage;