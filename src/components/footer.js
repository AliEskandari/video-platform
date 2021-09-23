import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import * as ROUTES from "../constants/routes";

export default function footer() {
  return (
    <footer className="py-3 my-4 border-top">
      <Container className="d-flex flex-wrap justify-content-between align-items-center">
        <Col md={4}>
          <ul className="nav justify-content-start list-unstyled d-flex">
            <li className="ms-3">
              <Link
                className="text-muted text-decoration-none"
                to={ROUTES.ABOUT}
              >
                About
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="text-muted text-decoration-none"
                to={ROUTES.TERMS}
              >
                Terms
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="text-muted text-decoration-none"
                to={ROUTES.CONTACT}
              >
                Contact
              </Link>
            </li>
            <li className="ms-3">
              <Link
                className="text-muted text-decoration-none"
                to={ROUTES.PRIVACY}
              >
                Privacy
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={4} className="d-flex justify-content-end align-items-center">
          <span className="text-muted">© 2021 DomumGym, Inc</span>
        </Col>
      </Container>
    </footer>
  );
}
