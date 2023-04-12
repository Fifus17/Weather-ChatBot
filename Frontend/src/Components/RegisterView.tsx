import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import React, { useContext, useReducer, useState } from "react";
import { auth, firestore } from "../FirebaseSetup/firebase";
import ColorContext from "../States/color-context";

import "./LoginView.css";

const RegisterView = (props: any) => {
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

  // Logic

  const [login, setLogin] = useState({ login: "", password: "" });

  const checkLogin: () => boolean = () => {
    if (login.login.includes("@") && login.password.length >= 8)
      return true;
    else return false;
  };

  const registerHandler = async (event: any) => {
    event.preventDefault();
    if (checkLogin()) {
      await createUserWithEmailAndPassword(auth, login.login, login.password).then(async (userCredential) => {
        const user = userCredential.user;
        const docRef = await addDoc(collection(firestore, "data_collection", "data", "users", user.uid, "chats"), {date: serverTimestamp()});
        // const docRef2 = await addCollection(doc(firestore, "data_collection", "data", "users", user.uid, "chats"), {});
        props.changeView(-3);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <div className="login-view-wrapper">
      <div className="login-view-inputs">
        <input
          className="login-view-textarea-login"
          placeholder="E-mail"
          value={login.login}
          style={{ border: loginBorderColor }}
          onFocus={loginBorderOn}
          onBlur={loginBorderOff}
          onChange={(event) =>
            setLogin({ login: event.target.value, password: login.password })
          }
        />
        <input
          className="login-view-textarea-password"
          placeholder="Password"
          value={login.password}
          style={{ border: passwordBorderColor }}
          onFocus={passwordBorderOn}
          onBlur={passwordBorderOff}
          onChange={(event) =>
            setLogin({ login: login.login, password: event.target.value })
          }
          type="password"
        />
      </div>
      <div className="login-view-buttons">
        <button
          style={{ backgroundColor: colorContext.color }}
          className="login-view-button-register"
          onClick={registerHandler}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterView;
