import React, { useState } from "react";
import "./SingleContact.css";
import { Tooltip } from "@zendeskgarden/react-tooltips";

import portfolio from "../Resources/online-resume.png";
import cv from "../Resources/cv.png";

const SingleContact = (props: {
  photo: string | undefined;
  name: string;
  work: string;
  mail?: string;
  github: string | undefined;
  linkedin: string | undefined;
  portfolio: boolean | undefined;
  cv: boolean | undefined;
}) => {

  const [mailTooltip, setMailTooltip] = useState("Copy e-mail address");

  const copyMail = () => {
    navigator.clipboard.writeText(props.mail ? props.mail : "XD");
    setMailTooltip("E-mail copied!");
  };
  
  return (
    <div className="single-contact-container">
      <div className="single-contact-photo-container">
        <img
          src={props.photo}
          alt="myPhoto"
          className="single-contact-photo"
        ></img>
      </div>
      <div className="single-contact-main-info-container">
        <h1 className="single-contact-name">{props.name}</h1>
        {/* <h4 className="single-contact-description">{props.description}</h4> */}
        <h4 className="single-contact-work-done">{props.work}</h4>
        {/* <h6 className="single-contact-email">{props.email}</h6> */}
      </div>
      <div className="single-contact-links">
        <Tooltip type="light" size="small" placement="bottom" content="Go to Github">
          <a href={props.github} target="blank1">
            <div className="github-logo single-contact-links-div"></div>
          </a>
        </Tooltip>
        <Tooltip type="light" size="small" placement="bottom" content="Go to Linkedin">
        <a href={props.linkedin} target="blank2">
          <div className="linkedin-logo single-contact-links-div"></div>
        </a>
        </Tooltip>
        {props.portfolio ? (
        <Tooltip type="light" size="small" placement="bottom" content="Go to my website!">
          <a href="https://github.com/Fifus17" target="blank">
            <img src={portfolio}/>
          </a>
        </Tooltip>
        ) : null}
        {props.cv ? (
        <Tooltip type="light" size="small" placement="bottom" content="Open CV">
          <a href="https://github.com/Fifus17" target="blank">
            <img src={cv}/>
          </a>
        </Tooltip>
        ) : null}
        <Tooltip type="light" size="small" placement="bottom" content={mailTooltip}>
          <div className="mail-logo single-contact-links-div" onClick={copyMail}></div>
        </Tooltip>
      </div>
    </div>
  );
};

export default SingleContact;
