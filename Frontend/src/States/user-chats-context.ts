import React from "react";
import type { CollectionReference, DocumentData } from 'firebase/firestore';


const UserChatsContext = React.createContext({
    chatsCollectionRef: null as CollectionReference<DocumentData> | null,
    userChats : [] as DocumentData[] | undefined,
    [Symbol.iterator](): IterableIterator<DocumentData> {
        if (this.userChats !== undefined) return this.userChats[Symbol.iterator]();
        else return [].values();
    }
});

export default UserChatsContext;