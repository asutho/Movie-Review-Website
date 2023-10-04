import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"


export function Signup ( props ) {
    
    return (
        <Container fluid className="test">
            <Row>
                <Col md={{span: 4, offset: 4}}>
                    <Form>
                        <h2>Sign up for an account</h2>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            onChange={(val) => console.log(evt.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" />
                        </Form.Group>
                        <Button variants="primary" type="submit" className="my-2">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}