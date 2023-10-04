import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

import { useState, useEffect, useContext } from "react"
import { FBAuthContext } from "../contexts/FBAuthContext"
import { createUserWithEmailAndPassword } from "firebase/auth"

export function Signup ( props ) {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ validEmail, setValidEmail ] = useState(false)
    const [ validPassword, setValidPassword] = useState(false)

    const FBAuth = useContext( FBAuthContext )

    useEffect( () => {
        if( email.indexOf('@') > 0 ) {
            setValidEmail(true)
        }
        else {
            setValidEmail(false)
        }
    }, [email] )

    useEffect( () => {
        if( password.length > 7 ) {
            setValidPassword(true)
        }
        else {
            setValidPassword(false)
        }
    }, [password] )

    const SignUpHandler = () => {
        createUserWithEmailAndPassword(FBAuth, email, password)
        .then( (user) => {
            // user is created in Firebase
            console.log(user)
        })
        .catch( (error) => {
            console.log( error.code, error.message )
        })
    }

    return (
        <Container fluid className="test">
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    <Form onSubmit={ (evt) => {
                        evt.preventDefault()
                        SignUpHandler()
                        }}>
                        <h2>Sign up for an account</h2>
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
                            placeholder="Create a password"
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
        </Container>
    )
}