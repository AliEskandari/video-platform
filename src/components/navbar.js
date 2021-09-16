import {
  Navbar as NavbarB,
  Form,
  Button,
  FormControl,
  Container,
  Col,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Navbar() {
  return (
    <NavbarB fixed="top" bg="light" expand="lg">
      <Container>
        <Col>
          <LinkContainer to="/">
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

            <Button variant="outline-success">Search</Button>
          </Form>
        </Col>
        <Col xs={4}></Col>
      </Container>
    </NavbarB>
  );
}
