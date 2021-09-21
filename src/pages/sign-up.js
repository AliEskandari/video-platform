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

        <p className="">Create an account</p>

        <Form onSubmit={handleSignIn}>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>

          <Button
            size="md"
            className="w-100 mb-4"
            variant="primary"
            type="submit"
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

          <Button size="md" className="w-100" variant="secondary" type="submit">
            SIGN IN WITH GOOGLE
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
