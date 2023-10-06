import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Card, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    if (enteredPassword !== enteredConfirmPassword) {
      console.log("enter same password");
      toast.error("please enter same password");
    } else {
      setIsLoading(true);
      const newDetails = {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      };

      console.log(newDetails);
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`,
          newDetails
        );
        console.log(response.data);
        history.replace("/login");
      } catch (err) {
        let errorMessage = "Authentication failed";
        if (err.response.data.error && err.response.data.error.message)
          errorMessage = err.response.data.error.message;
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Container
        className="shadow"
        style={{
          width: "25rem",
          padding: ".5rem",
        }}
      >
        <Card>
          <Card.Body className="text-center">
            <h5 style={{ marginBottom: 9 }}>Register</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required
                  ref={emailInputRef}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  required
                  ref={passwordInputRef}
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="password"
                  required
                  ref={confirmPasswordInputRef}
                />
              </Form.Group>
              {isLoading && <p>Sending Request</p>}
              {!isLoading && (
                <Button variant="primary" type="submit">
                  Register
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
        <Button
          variant="Link"
          as={Link}
          to="/login"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            marginTop: "10px",
            backgroundColor: "#e8f7f0",
          }}
        >
          Already Have an Account?
        </Button>
      </Container>
    </Container>
  );
};

export default Register;
