import SingleContact from "./SingleContact";
import "./ContactView.css";
import photoFilip from "../Resources/FilipPlaceholder.png";
import photoNatalia from "../Resources/Natalia.png";
import cv from "../Resources/DziurdziaFilipCV.pdf";
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
        mail={"filipdziurdzia2002@gmail.com"}
        github={"https://github.com/Fifus17"}
        linkedin={"https://www.linkedin.com/in/filip-dziurdzia-3b97031bb/"}
        // portfolioLink=""
        portfolio={false}
        cvPath={cv}
        cv
      />
      <SingleContact
        photo={photoNatalia}

        name={"Natalia Adamiak"}
        // description={"CS Student"}
        // email={"filipdziurdzia2002@gmail.com"}
        work={"Computer Science student"}
        mail={"nat.adamiak@gmail.com"}
        github={"https://github.com/Neashe"}
        linkedin={""}
        // portfolioLink=""
        portfolio={false}
        //cvPath={cv}
        cv
      />
    </div>
  );
};

export default ContactView;
