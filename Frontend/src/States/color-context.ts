import React from "react";
import { PALETTE } from "@zendeskgarden/react-theming";

const ColorContext = React.createContext({
    color: PALETTE.green[400],
    name: "Green-400",
    col: 2,
    row: 3,
});

export default ColorContext;