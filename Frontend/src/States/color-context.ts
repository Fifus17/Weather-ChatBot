import React from "react";
import { PALETTE } from "@zendeskgarden/react-theming";

const ColorContext = React.createContext({
    color: PALETTE.green[400],
    name: "Green-400",
    col: 1,
    row: 3,
    onChange: (rowIdx: number, colIdx: number) => {},
    onSelect: (rowIdx: number, colIdx: number) => {},
});

export default ColorContext;