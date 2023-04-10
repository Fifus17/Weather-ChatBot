import "./App.css";
import Chat from "./Components/Chat";
import MessageInput from "./Components/MessageInput";
import Layout from "./Components/Layout";
import { PALETTE, ThemeProvider } from "@zendeskgarden/react-theming";
import React, { Component, useState } from "react";
import { matrix } from "./Components/SettingsColorSwatch";
import ColorContext from "./States/color-context";

function App() {
  const [selectedRowIndex, setSelectedRowIndex] = useState(3);
  const [selectedColIndex, setSelectedColIndex] = useState(1);
  const [currentColor, setCurrentColor] = useState(PALETTE.green[400]);
  const [currentColorName, setCurrentColorName] = useState("Green-400");

  const onChange = (rowIdx: number, colIdx: number) => {
    setCurrentColor(matrix[rowIdx][colIdx].value);
    setCurrentColorName(matrix[rowIdx][colIdx].label);
  };
  const onSelect = (rowIdx: number, colIdx: number) => {
    setSelectedRowIndex(rowIdx);
    setSelectedColIndex(colIdx);
  };

  return (
    <div className="App">
      <ColorContext.Provider
        value={{
          color: currentColor,
          name: currentColorName,
          row: selectedRowIndex,
          col: selectedColIndex,
          onChange: onChange,
          onSelect: onSelect,
        }}
      >
        <ThemeProvider>
          <Layout />
        </ThemeProvider>
      </ColorContext.Provider>
    </div>
  );
}

export default App;
