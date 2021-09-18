import {
  Navbar as NavbarB,
  Form,
  Button,
  FormControl,
  Container,
  Col,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import * as ROUTES from "../constants/routes";

export default function Navbar() {
  return (
    <NavbarB fixed="top" bg="light" expand="lg" className="border-bottom">
      <Container>
        <Col>
          <LinkContainer to={ROUTES.HOME}>
            <NavbarB.Brand>DomumGym</NavbarB.Brand>
          </LinkContainer>
        </Col>
        <Col>
          <Form className="d-flex justify-content">
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              aria-label="Search"
            />

            <Button variant="outline-primary">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
        </Col>
        <Col xs={4}>
          <LinkContainer to={ROUTES.SIGN_IN} className="float-end">
            <Button variant="outline-primary">Sign In</Button>
          </LinkContainer>
        </Col>
      </Container>
    </NavbarB>
  );
}
