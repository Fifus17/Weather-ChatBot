import React from "react";
import SettingsColorSwatch from "./SettingsColorSwatch";

import "./SettingsView.css";

const SettingsView = () => {
  return (
    <div className="settings-view-color-swatch">
      <h2>Color theme </h2>
      <SettingsColorSwatch />
    </div>
  );
};

export default SettingsView;