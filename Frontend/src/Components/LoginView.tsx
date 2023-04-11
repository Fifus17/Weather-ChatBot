import React, { useContext, useState } from "react";
import ColorContext from "../States/color-context";

const LoginView = () => {
  const [borderColor, setBorderColor] = useState("1px solid transparent");

  const colorContext = useContext(ColorContext);

  const textareaBorderOn = (event: any) => {
    setBorderColor(`1px solid ${colorContext.color}`);
  };

  const textareaBorderOff = (event: any) => {
    setBorderColor("1px solid transparent");
  };
  return (
    <div className="login-view-wrapper">
      <textarea
        className="login-view-textarea-login"
        // value={props.message}
        placeholder="E-mail"
        style={{ border: borderColor }}
        // onChange={props.textareaHandler}
        // onKeyDown={props.enterPress}
        onFocus={textareaBorderOn}
        onBlur={textareaBorderOff}
      />
      <textarea
        className="login-view-textarea-password"
        // value={props.message}
        placeholder="E-mail"
        style={{ border: borderColor }}
        // onChange={props.textareaHandler}
        // onKeyDown={props.enterPress}
        onFocus={textareaBorderOn}
        onBlur={textareaBorderOff}
      />
    </div>
  );
};

export default LoginView;
