import SingleContact from "./SingleContact";
import "./ContactView.css";
import photoFilip from "../Resources/FilipPlaceholder.png";
import React from "react";

const ContactView = (props: any) => {
  return (
    <div className="contact-view-container">
      <SingleContact
        photo={photoFilip}
        name={"Filip Dziurdzia"}
        // description={"CS Student"}
        // email={"filipdziurdzia2002@gmail.com"}
        work={"Frontend, Backend, Neural Network"}
        github={"https://github.com/Fifus17"}
        linkedin={"https://www.linkedin.com/in/filip-dziurdzia-3b97031bb/"}
        portfolio
        cv
      />
      <SingleContact
        photo={photoFilip}
        name={"Natalia Adamiak"}
        // description={"CS Student"}
        // email={"bagnobagno@gmail.com"}
        work={"Neural Network, Weather API"} 
        github={undefined} 
        linkedin={undefined} 
        portfolio={undefined} 
        cv={undefined}     
        />
    </div>
  );
};

export default ContactView;
