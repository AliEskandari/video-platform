import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuvRw1y5179rLdkCERkxULGsmE7veOPjE",
  authDomain: "domumgym-ff54d.firebaseapp.com",
  projectId: "domumgym-ff54d",
  storageBucket: "domumgym-ff54d.appspot.com",
  messagingSenderId: "525758429573",
  appId: "1:525758429573:web:e47f9082671d711d1b6cec",
  measurementId: "G-8DTQM9ZT3P",
};

const firebase = initializeApp(firebaseConfig);

export { firebase };
