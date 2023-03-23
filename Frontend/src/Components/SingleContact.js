import "./SingleContact.css";
import github from "../Resources/github.svg"
import linkedin from "../Resources/linkedin.svg"
import mail from "../Resources/mail.svg"
import portfolio from "../Resources/portfolio.svg"

const SingleContact = (props) => {
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
        <a href={props.github} target="blank">
            <img src={github} alt="github-logo"/>
        </a>
        <a href={props.linkedin} target="blank">
            <img src={linkedin} alt="linkedin-logo"/>
        </a>
        {props.portfolio ? <a href="https://github.com/Fifus17" target="blank">
            <img src={portfolio} alt="portfolio-logo"/>
        </a> : null}
            <img src={mail} alt="mail-logo"/>
      </div>
    </div>
  );
};

export default SingleContact;
