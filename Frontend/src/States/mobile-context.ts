import React from "react";


const MobileContext = React.createContext({
    isMobile: window.matchMedia('(max-width: 767px)').matches
});

export default MobileContext;