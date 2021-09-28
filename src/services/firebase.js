import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../lib/firebase";

const db = getFirestore(app);
const auth = getAuth(app);

export async function doesUsernameExist(username) {
  // const result = await firebase
  //   .firestore()
  //   .collection("users")
  //   .where("username", "==", username.toLowerCase())
  //   .get();
  // return result.docs.length > 0;
}

export async function doesEmailExist(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.length > 0;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!doesEmailExist(user.email)) {
    // firebase user collection (create a document)
    await addDoc(collection(db, "users"), {
      userId: user.uid,
      fullName: user.displayName,
      emailAddress: user.email.toLowerCase(),
      following: [],
      followers: [],
      dateCreated: Date.now(),
    });
  }
}
