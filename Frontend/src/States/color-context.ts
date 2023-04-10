import React from "react";
import { PALETTE } from "@zendeskgarden/react-theming";

const ColorContext = React.createContext({
    color: PALETTE.green[400]
});

export default ColorContext;