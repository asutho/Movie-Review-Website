import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref } from 'firebase/storage'

//contexts
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext'

export function Home () {
    const[ data, setData ] = useState([])

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)

    const getData = async () => {
        //get darta from Firebase collections called 'Books'
        const querySnapshot = await getDocs(collection(FBDb, "Books"))
        //an arrary to store all of the books from Firebase
        let books = []
        querySnapshot.forEach( (doc) => {
            let book = []
            book.id = doc.id
            //add the book to the array 
            books.push(book)
        })
        //set the books array as the data state
        setData(books)
    }
    useEffect( () => {
        if( data.length === 0 ) {
            getData()
        }
    })

    const Columns = data.map( (book, key) => {
        return(
            <Col md="4" key={key}>
                <Card>
                    <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                    </Card.Body>
                </Card>
            </Col>
        )
    })
    return (
        <Container>
            <Row>
                {Columns}
            </Row>
        </Container>
    )
}