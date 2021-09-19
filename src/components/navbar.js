import {
  Navbar as NavbarB,
  Form,
  Button,
  FormControl,
  Container,
  Col,
  NavDropdown,
  Dropdown,
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

            <Button variant="primary">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
        </Col>
        <Col xs={4}>
          <div className="float-end">
            <LinkContainer to={ROUTES.UPLOAD}>
              <Button variant="primary">
                <i class="bi bi-camera-video"></i>
              </Button>
            </LinkContainer>
            <LinkContainer to={ROUTES.SIGN_IN}>
              <Button variant="primary" className="ms-2">
                SIGN IN
              </Button>
            </LinkContainer>
            <Dropdown as="span">
              <Dropdown.Toggle className="ms-2">
                <i class="bi bi-person"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">
                  <i class="bi bi-person"></i>&nbsp;My Profile
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  <i class="bi bi-gear"></i>&nbsp;Settings
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item href="#/action-3">
                  <i class="bi bi-credit-card"></i>&nbsp;Your Cards
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                  <i class="bi bi-bank"></i>&nbsp;Add bank
                </Dropdown.Item>

                <Dropdown.Divider />
                <LinkContainer to={ROUTES.SIGN_IN}>
                  <Dropdown.Item href="#/action-3">
                    <i class="bi bi-box-arrow-left"></i>&nbsp;Logout
                  </Dropdown.Item>
                </LinkContainer>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Container>
    </NavbarB>
  );
}
