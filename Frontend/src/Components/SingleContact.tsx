import React from "react";
import "./SingleContact.css";
import { Tooltip } from '@zendeskgarden/react-tooltips'
import { Button } from '@zendeskgarden/react-buttons';

const SingleContact = (props: { photo: string | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; work: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; github: string | undefined; linkedin: string | undefined; portfolio: any; }) => {
  return (
    <div className="single-contact-container">
      <div className="single-contact-photo-container">
        <img src={props.photo} alt="myPhoto" className="single-contact-photo"></img>
      </div>
      <div className="single-contact-main-info-container">
        <h1 className="single-contact-name">{props.name}</h1>
        {/* <h4 className="single-contact-description">{props.description}</h4> */}
        <h4 className="single-contact-work-done">{props.work}</h4>
        {/* <h6 className="single-contact-email">{props.email}</h6> */}
      </div>
      <div className="single-contact-links">
        <Tooltip type="light" size="small" content="My profile on Github">
          <a href={props.github} target="blank1">
              <div className="github-logo"></div>
          </a>
        </Tooltip>
        <a href={props.linkedin} target="blank2">
            <div className="linkedin-logo"></div>
        </a>
        {props.portfolio ? <a href="https://github.com/Fifus17" target="blank">
            <div className="portfolio-logo"></div>
        </a> : null}
        <div className="mail-logo"></div>
      </div>
    </div>
  );
};

export default SingleContact;
