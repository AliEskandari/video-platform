import "./navbar.css";

import {
  Navbar as NavbarB,
  Form,
  Button,
  FormControl,
  Container,
  Col,
  NavDropdown,
  Dropdown,
  Image,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import * as ROUTES from "../constants/routes";

export default function Navbar() {
  return (
    <NavbarB fixed="top" bg="light" expand="lg" className="border-bottom">
      <Container>
        {/* Logo */}
        <Col>
          <LinkContainer to={ROUTES.HOME}>
            <NavbarB.Brand>DomumGym</NavbarB.Brand>
          </LinkContainer>
        </Col>
        {/* Search */}
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
        {/* Menu Buttons */}
        <Col xs={4}>
          <div className="float-end">
            <LinkContainer to={ROUTES.UPLOAD}>
              <Button variant="primary">
                <i className="bi bi-camera-video"></i>
              </Button>
            </LinkContainer>

            <LinkContainer
              to={ROUTES.SIGN_IN}
              className="d-none d-md-inline-block"
            >
              <Button variant="primary" className="ms-2">
                SIGN IN
              </Button>
            </LinkContainer>

            {/* DROPDOWN */}
            <Dropdown as="span" align="end">
              <Dropdown.Toggle className="ms-2">
                <i className="bi bi-person"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ width: "20rem" }}>
                <Dropdown.ItemText>
                  <div className="text-truncate">
                    <Image
                      style={{ width: 64, height: 64 }}
                      src="https://via.placeholder.com/88x88"
                      roundedCircle
                    />
                    <span className="ms-3 align-middle fs-4">
                      Sally Sunrise
                    </span>
                  </div>
                </Dropdown.ItemText>

                <Dropdown.Divider />

                <LinkContainer to={ROUTES.PROFILE}>
                  <Dropdown.Item>
                    <i className="bi bi-person"></i>
                    <span className="ms-3">My Profile</span>
                  </Dropdown.Item>
                </LinkContainer>

                <LinkContainer to={ROUTES.SETTINGS}>
                  <Dropdown.Item>
                    <i className="bi bi-gear"></i>
                    <span className="ms-3">Settings</span>
                  </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider />

                <LinkContainer to={ROUTES.PAYMENTS}>
                  <Dropdown.Item>
                    <i className="bi bi-credit-card"></i>
                    <span className="ms-3">Your Cards</span>
                  </Dropdown.Item>
                </LinkContainer>

                <LinkContainer to={ROUTES.BANKING}>
                  <Dropdown.Item>
                    <i className="bi bi-bank"></i>
                    <span className="ms-3">Add bank</span>
                  </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider />

                <LinkContainer to={ROUTES.SIGN_IN}>
                  <Dropdown.Item>
                    <i className="bi bi-box-arrow-left"></i>
                    <span className="ms-3">Logout</span>
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
