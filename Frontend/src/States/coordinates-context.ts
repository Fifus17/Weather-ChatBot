import React from "react";
import { PALETTE } from "@zendeskgarden/react-theming";

const CoordinatesContext = React.createContext({
    longitude: 0,
    latitude: 0
});

export default CoordinatesContext;