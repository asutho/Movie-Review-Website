import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import { Navigation } from "./Navigation"

export function Header( props ) {
    return (
        <Navbar bg='black' variant='dark' expand='lg'>
            <Container>
                <Navbar.Brand>
                    MOVIE CLUB
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav"/>
                <Navbar.Collapse id="main-nav">
                    <Navigation/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}