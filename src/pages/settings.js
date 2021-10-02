import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Form, Button, Col } from "react-bootstrap";
import UserContext from "../context/user";
import useUser from "../hooks/use-user";
import { deleteUser, updateUser } from "../services/firebase";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";

export default function Settings() {
  const { user: authUser } = useContext(UserContext);
  const { user } = useUser(authUser.uid);
  const history = useHistory();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [country, setCountry] = useState("");
  const [motivatement, setMotivatement] = useState("");

  useEffect(() => {
    if (user) {
      // pre-fill values for form
      setName(user.name || "");
      setBio(user.bio || "");
      setSpecialty(user.specialty || "");
      setCountry(user.country || "");
      setMotivatement(user.motivatement || "");
    }
  }, [user]);

  const handleDeleteAccount = () => {
    deleteUser(authUser);
  };

  const handleUpdateSettings = async (event) => {
    event.preventDefault();

    try {
      await updateUser(authUser.uid, {
        name,
        bio,
        specialty,
        country,
        motivatement,
      });
      history.push(ROUTES.PROFILE);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} xl={6} className="border-3">
          <Form>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">Profile</h2>
              <Button
                variant="primary"
                type="submit"
                size=""
                onClick={handleUpdateSettings}
              >
                SAVE
              </Button>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter channel name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your channel"
                value={bio}
                onChange={({ target }) => setBio(target.value)}
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={({ target }) => setCountry(target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex. Cardio"
                  value={specialty}
                  onChange={({ target }) => setSpecialty(target.value)}
                />
              </Form.Group>
            </Row>
            <Form.Group className="pb-3">
              <Form.Label>Motivatement</Form.Label>
              <Form.Control
                type="text"
                placeholder="Give it 110%!"
                value={motivatement}
                onChange={({ target }) => setMotivatement(target.value)}
              />
            </Form.Group>
          </Form>
          <hr />
          <Row>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">Account</h2>
              <Button variant="primary" type="submit" size="">
                SAVE
              </Button>
            </div>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Row>
          <Button onClick={handleDeleteAccount}>Delete Account</Button>
        </Col>
      </Row>
    </Container>
  );
}
