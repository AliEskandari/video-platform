import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Firebase
import FirebaseContext from "./context/firebase";
import { app } from "./lib/firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={{ app }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
