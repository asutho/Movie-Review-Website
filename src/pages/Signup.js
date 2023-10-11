import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { doc, getDoc, setDoc } from "firebase/firestore"

import { useState, useEffect, useContext } from "react"
import { FBAuthContext } from "../contexts/FBAuthContext"
import { FBDbContext } from "../contexts/FBDbContext"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Navigate, useNavigate } from "react-router-dom"

export function Signup ( props ) {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ validEmail, setValidEmail ] = useState(false)
    const [ validPassword, setValidPassword] = useState(false)
    const [ username, setUsername ] = useState("")
    const [ validUsername, setValidUsername] = useState(false)
    const [userNameFeedback, setUserNameFeedback] = useState

    const FBAuth = useContext( FBAuthContext )
    const FBDb = useContext( FBDbContext)
    const navigate = useNavigate(  )

    const allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890_-"
    //timer varaible
    let timer 
    //function to check if username exists in Firebase
    const checkUser = async (user) => {
        const ref = doc( FBDb, "usernames", user)
        const docSnap = await getDoc(ref)
        if(docSnap.exists()) {
            //user already exists
            //console.log("exists")
            setUserNameFeedback("Username is already taken")
            setValidUsername(false)
        }
        else {
            //user does not exist
            //console.log("doesn't exist")
            setUserNameFeedback(null)
            setValidUsername(true)
        }
    }

    useEffect( () => {
        let userLength = false
        let noIllegalChars = []
        
        if(username.length < 5) {
            userLength = false
        }
        else {
            userLength = true
        }
        //check if username is made of allowed chars and is the username exists in Firebase
        const chars = Array.from(username)
        chars.forEach((chr) => {
            if(allowedChars.includes(chr) === false) {
                noIllegalChars = false
            }
            else {
                noIllegalChars = true
            }
        if (userLength === true && noIllegalChars === true) {
        clearTimeout(timer)
        timer = setTimeout(() => {checkUser(username)}, 1500)
        }
        }, [username])
        })

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
    
    const AddUserName = async () => {
        await setDoc(doc(FBDb, "usernames", username), {
            name: username
        })
    }

    const SignUpHandler = () => {
        createUserWithEmailAndPassword(FBAuth, email, password)
        .then( (user) => {
            // user is created in Firebase
            // console.log(user)
            AddUserName()
            navigate("/")
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
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Choose a unique username"
                            onChange={(evt) => setUsername(evt.target.value)}
                            value={username}
                            isValid={validUsername}
                            />
                            <div>{userNameFeedback}</div>
                            <Form.Control.Feedback>Looks Good</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{userNameFeedback}</Form.Control.Feedback>
                        </Form.Group>
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
                            disabled = { ( validEmail && validPassword && validUsername ) ? false: true }
                        >
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}