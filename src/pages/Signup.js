import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useState, useEffect, useContext } from "react";
import { FBAuthContext } from "../contexts/FBAuthContext";
import { FBDbContext } from "../contexts/FBDbContext";
import { AuthErrorCodes, createUserWithEmailAndPassword } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";

export function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFeedback, setUsernameFeedback] = useState("");
  const [emailFeedback, setEmailFeedback] = useState(""); // Add emailFeedback state

  const FBAuth = useContext(FBAuthContext);
  const FBDb = useContext(FBDbContext);
  const navigate = useNavigate();

  const allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890_-";

  // Timer variable
  let timer;
  // Function to check if username exists in Firebase
  const checkUser = async (user) => {
    const ref = doc(FBDb, "usernames", user);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      // User already exists
      setUsernameFeedback("Username is already taken");
      setValidUsername(false);
    } else {
      // User does not exist
      setUsernameFeedback("Username is available");
      setValidUsername(true);
    }
  };

  useEffect(() => {
    let userLength = false;
    let noIllegalChars = [];

    if (username.length < 5) {
      userLength = false;
    } else {
      userLength = true;
    }
    // Check if username is made of allowed chars and if the username exists in Firebase
    const chars = Array.from(username);
    chars.forEach((chr) => {
      if (!allowedChars.includes(chr)) {
        noIllegalChars = false;
      } else {
        noIllegalChars = true;
      }
      if (userLength === true && noIllegalChars === true) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          checkUser(username);
        }, 1500);
      }
    }, [username]);
  });

  useEffect(() => {
    if (email.indexOf("@") > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (
      password.length > 8 &&
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password)
    ) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  const AddUserName = async () => {
    await setDoc(doc(FBDb, "usernames", username), {
      name: username,
    });
  };

  const SignUpHandler = () => {
    createUserWithEmailAndPassword(FBAuth, email, password)
      .then((user) => {
        // User is created in Firebase
        // console.log(user)
        AddUserName();
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
          setEmailFeedback("Email address is already in use");
        }
      });
  };

  return (
    <Container fluid className="test">
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form
            onSubmit={(evt) => {
              evt.preventDefault();
              SignUpHandler();
            }}
          >
            <h2>Sign up for an account</h2>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a unique username"
                onChange={(evt) => setUsername(evt.target.value)}
                value={username}
                isValid={validUsername}
              />
              <Form.Control.Feedback>Username available</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {usernameFeedback}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                onChange={(evt) => setEmail(evt.target.value)}
                value={email}
                isValid={validEmail}
              />
              <Form.Control.Feedback>Email address not in use</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {emailFeedback}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                onChange={(evt) => setPassword(evt.target.value)}
                value={password}
                isValid={validPassword}
              />
            </Form.Group>
            <Button
              variants="primary"
              type="submit"
              className="my-2"
              disabled={
                validEmail && validPassword && validUsername ? false : true
              }
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
