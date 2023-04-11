import React from "react";
import type { DocumentData } from 'firebase/firestore';


const UserChatsContext = React.createContext({
    userChats : [] as DocumentData[] | undefined,
    [Symbol.iterator](): IterableIterator<DocumentData> {
        if (this.userChats !== undefined) return this.userChats[Symbol.iterator]();
        else return [].values();
    }
});

export default UserChatsContext;