import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as ROUTES from "../constants/routes";

export default function SignIn() {
  const history = useHistory();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      history.push(ROUTES.HOME);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  useEffect(() => {
    document.title = "Sign In - DomumGym";
  }, []);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6} xl={4} className="border-3">
        <h1>DomumGym</h1>
        <h2 className="mb-5 fw-light">Sign up to start working out</h2>

        <p className="">Sign in</p>

        <Form onSubmit={handleSignIn}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button
            size="md"
            className="w-100 mb-4"
            variant="primary"
            type="submit"
          >
            SIGN IN
          </Button>

          <div className="text-center mb-4">
            <Link to={ROUTES.SIGN_UP} className="text-decoration-none">
              Sign up for DomumGym
            </Link>
          </div>

          <Button size="md" className="w-100" variant="secondary" type="submit">
            SIGN IN WITH GOOGLE
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
