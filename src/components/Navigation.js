import { useContext } from 'react'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom'
//contexts
import { NavContext } from '../contexts/NavContext'

export function Navigation (props) {
    const NavItems = useContext( NavContext )

    const Items = NavItems.map( (item) => {
        return (
            <Nav.Item>
                <Nav.Link>{item.name}</Nav.Link>
            </Nav.Item>
        )
    })
    return (
        <Nav>
            { Items }
        </Nav>
    )
}