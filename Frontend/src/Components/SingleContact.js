

const SingleContact = (props) => {

    return (
        <div className="single-contact-container">
            <div className="single-contact-photo-container">
                <img src={props.photo} className="single-contact-photo"></img>
            </div>
        </div>
    );
}

export default SingleContact;