import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"



import { useState, useEffect, useContext } from "react"
import { FBAuthContext } from "../contexts/FBAuthContext"
import { signInWithEmailAndPassword, getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { firebaseConfig } from "../config/Config"
import { initializeApp } from 'firebase/app';
import React from 'react'


export function Signin ( props ) {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ validEmail, setValidEmail ] = useState(false)
    const [ validPassword, setValidPassword] = useState(false)

    const FBAuth = useContext( FBAuthContext )
    const navigate = useNavigate (  )

    useEffect( () => {
        if( email.indexOf('@') > 0 ) {
            setValidEmail(true)
        }
        else {
            setValidEmail(false)
        }
    }, [email] )

    useEffect( () => {
        if( password.length > 7) {
            setValidPassword(true)
        }
        else {
            setValidPassword(false)
        }
    }, [password] )

    const SignInHandler = () => {
        signInWithEmailAndPassword(FBAuth, email, password)
        .then( (user) => {
            // user data retrieved from Firebase
            // console.log(user)
            // take user to home page ("/")
            navigate("/")
        })
        .catch( (error) => {
            console.log( error.code, error.message )
        })
    }

    const SignInWithGoogle = async () => {
        const auth = getAuth(); // Get the Firebase Auth instance
        const provider = new GoogleAuthProvider(); // Create a Google Auth provider
    
        try {
          await signInWithRedirect(auth, provider); // Redirect to Google Sign-In page
        } catch (error) {
          console.error('Error signing in with Google:', error);
        }
      };


    return (
        <Container fluid className="test">
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    <Form onSubmit={ (evt) => {
                        evt.preventDefault()
                        SignInHandler()
                        }}>
                        <h2>Sign in to your account</h2>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            onChange={ (evt) => setEmail(evt.target.value) }
                            value={email}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            onChange={ (evt) => setPassword(evt.target.value) }
                            value={password}
                            />
                        </Form.Group>
                        <Button
                            variants="primary" 
                            type="submit"
                            className="my-2"
                            disabled = { ( validEmail && validPassword ) ? false: true }
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button class="social-signin google" id="login" onClick={SignInWithGoogle}>Login with Google</Button>    
                </Col>
            </Row>
        </Container>
    )
}