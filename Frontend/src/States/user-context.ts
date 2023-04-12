import { User } from "firebase/auth";
import React from "react";

export const UserContext = React.createContext({
    user: null as User | null | undefined,
});