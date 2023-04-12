import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../FirebaseSetup/firebase";
import ColorContext from "../States/color-context";
import SettingsColorSwatch from "./SettingsColorSwatch";

import "./SettingsView.css";

const SettingsView = () => {
  const colorContext = useContext(ColorContext);

  const [user] = useAuthState(auth);

  const logoutHandler = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
        console.log("Signed out successfully")
      }).catch((error) => {
        console.log(error)
      });
  };


  return (
    <div className="settings-view-wrapper">
      <div className="settings-view-color-swatch">
        <h2>Color theme </h2>
        <SettingsColorSwatch />
      </div>
      {user ? <div className="settings-view-logout">
        <button style={{backgroundColor: colorContext.color}} onClick={logoutHandler}>Logout</button>
      </div> : null}
    </div>
  );
};

export default SettingsView;
