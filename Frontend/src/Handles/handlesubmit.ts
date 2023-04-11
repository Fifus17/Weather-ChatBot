import { addDoc, collection } from "@firebase/firestore";
import { firestore } from "../FirebaseSetup/firebase";

const handleSubmit = (testdata: any) => {
    const ref = collection(firestore, "test") // Firebase creates this automatically

    let data = {
        testData: testdata
    }

    try {
        addDoc(ref, data);
    } catch(err) {
        console.log("Error adding document: ");
        console.log(err);
    }
}

export default handleSubmit;