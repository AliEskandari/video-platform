import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import * as ROUTES from "../constants/routes";

// Firebase
import FirebaseContext from "../context/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { signInWithGoogle } from "../services/firebase";

export default function SignIn() {
  const history = useHistory();

  const { app } = useContext(FirebaseContext);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      const createdUserResult = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );

      // authentication
      // -> emailAddress & password & full name (displayName)
      await updateProfile(createdUserResult.user, {
        displayName: fullName,
      });

      // firebase user collection (create a document)
      await addDoc(collection(db, "users"), {
        userId: createdUserResult.user.uid,
        fullName,
        emailAddress: emailAddress.toLowerCase(),
        following: [],
        followers: [],
        dateCreated: Date.now(),
      });

      history.push(ROUTES.HOME);
    } catch (error) {
      setFullName("");
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async (event) => {
    event.preventDefault();

    try {
      await signInWithGoogle();
      history.push(ROUTES.HOME);
    } catch (error) {
      setFullName("");
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  useEffect(() => {
    document.title = "Sign Up - DomumGym";
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} xl={4} className="border-3">
          <h1>DomumGym</h1>
          <h2 className="mb-5 fw-light">
            Hit the gym with the click of a mouse
          </h2>
          <p className="">Create an account</p>
          <Form>
            {error && <p className="mb-4 text-danger">{error}</p>}
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={({ target }) => setFullName(target.value)}
                value={fullName}
              />
            </Form.Group>
            <Button
              size="md"
              className="w-100 mb-4"
              variant="primary"
              type="submit"
              disabled={isInvalid}
              onClick={handleSignUp}
            >
              SIGN UP
            </Button>
            <hr />
            <div className="text-center mb-4">
              Already have an account? &nbsp;
              <Link to={ROUTES.SIGN_IN} className="text-decoration-none">
                Sign In
              </Link>
            </div>
            <Button
              size="md"
              className="w-100"
              variant="secondary"
              type="submit"
              onClick={handleGoogleSignUp}
            >
              SIGN IN WITH GOOGLE
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
