import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { Card, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  function removeSpecialCharacters(email) {
    return email.replace(/[.@]/g, "");
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    const userDetails = {
      email: enteredEmail,
      password: enteredPassword,
    };

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`,
        userDetails
      );
      console.log(response.data.idToken);
      dispatch(
        authActions.login({
          token: response.data.idToken,
          email: removeSpecialCharacters(enteredEmail),
        })
      );
      history.replace("/home");
    } catch (err) {
      let errorMessage = "User doesn't exist";
      if (err.response.data.error && err.response.data.error.message)
        errorMessage = err.response.data.error.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            <h5 style={{ marginBottom: 9 }}>Log In</h5>
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

              <Button
                variant="Link"
                as={Link}
                to="/forget"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Forget Password?
              </Button>

              {isLoading && <p>Sending Request</p>}
              {!isLoading && (
                <Button variant="primary" type="submit">
                  Login
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
        <Button
          variant="Link"
          as={Link}
          to="/register"
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            marginTop: "10px",
            backgroundColor: "#e8f7f0",
          }}
        >
          New User?
        </Button>
      </Container>
    </Container>
  );
};

export default Login;
