import React, { useRef, useState } from "react";

import axios from "axios";
import { Card, Form, Button, Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UpdateProfile = (props) => {
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);

  const nameInputRef = useRef();
  const profilePhotoUrlRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredPhotoUrl = profilePhotoUrlRef.current.value;

    setIsLoading(true);
    const userDetails = {
      idToken: token,
      displayName: enteredName,
      photoUrl: enteredPhotoUrl,
      returnSecureToken: false,
    };

    console.log(userDetails);
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`,
        userDetails
      );
      console.log(response.data);
      props.onUpdate();
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err.response.data.error && err.response.data.error.message)
        errorMessage = err.response.data.error.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Container
        className="shadow"
        style={{
          width: "25rem",
          padding: ".5rem",
        }}
      >
        <Card>
          <Card.Body className="text-center">
            <h5 style={{ marginBottom: 9 }}>Contact Details</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  required
                  ref={nameInputRef}
                />
              </Form.Group>

              <Form.Group controlId="formPhotoUrl" className="mb-3">
                <Form.Label>Profile Photo URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your profile photo url"
                  name="photo"
                  required
                  ref={profilePhotoUrlRef}
                />
              </Form.Group>

              {isLoading && <p>Sending Request</p>}
              {!isLoading && (
                <Button variant="primary" type="submit">
                  Update
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};
export default UpdateProfile;
