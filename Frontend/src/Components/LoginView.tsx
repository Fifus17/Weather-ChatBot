import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth } from "../FirebaseSetup/firebase";
import ColorContext from "../States/color-context";

import "./LoginView.css";

const LoginView = (props: any) => {

  // Styling
  const [loginBorderColor, setLoginBorderColor] = useState(
    "1px solid transparent"
  );
  const [passwordBorderColor, setPasswordBorderColor] = useState(
    "1px solid transparent"
  );

  const colorContext = useContext(ColorContext);

  const loginBorderOn = (event: any) => {
    setLoginBorderColor(`1px solid ${colorContext.color}`);
  };

  const passwordBorderOn = (event: any) => {
    setPasswordBorderColor(`1px solid ${colorContext.color}`);
  };

  const loginBorderOff = (event: any) => {
    setLoginBorderColor("1px solid transparent");
  };

  const passwordBorderOff = (event: any) => {
    setPasswordBorderColor("1px solid transparent");
  };

  const [backgroundColor, setBackgroundColor] = useState('rgb(228, 233, 240)');

  // Logic

  const [login, setLogin] = useState({login: "", password: ""});

  const checkLogin: () => boolean = () => {
    if (login.login.includes('@') && login.password.length >= 8) return true;
    else return false;
  }

  const loginHandler = async (event: any) => {
    event.preventDefault();
    if (checkLogin()) {
      signInWithEmailAndPassword(auth, login.login, login.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            props.changeView(1);
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }
    else setBackgroundColor('rgb(245, 181, 186)');
  };

  return (
    <div className="login-view-wrapper">
      <div className="login-view-inputs">
        <input
          className="login-view-textarea-login"
          placeholder="E-mail"
          value={login.login}
          style={{ border: loginBorderColor , background: backgroundColor}}
          onFocus={loginBorderOn}
          onBlur={loginBorderOff}
          onChange={(event) => setLogin({login: event.target.value, password: login.password})}
        />
        <input
          className="login-view-textarea-password"
          placeholder="Password"
          value={login.password}
          style={{ border: passwordBorderColor , background: backgroundColor}}
          onFocus={passwordBorderOn}
          onBlur={passwordBorderOff}
          onChange={(event) => setLogin({login: login.login, password: event.target.value})}
          type="password"
        />
      </div>
      <div className="login-view-buttons">
        <button
          className="login-view-button-login"
          style={{ backgroundColor: colorContext.color }}
          onClick={loginHandler}
        >
          Login
        </button>
        <button
          style={{ backgroundColor: colorContext.color }}
          className="login-view-button-register"
          onClick={() => props.changeView(-5)}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginView;
