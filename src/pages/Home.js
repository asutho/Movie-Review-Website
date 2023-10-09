import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage'

//contexts
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext'

import '../Styles/Home.css'

export function Home () {
    const[ data, setData ] = useState([])

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)

    const getData = async () => {
        //get data from Firebase collections called 'Books'
        const querySnapshot = await getDocs(collection(FBDb, "Books"))
        //an arrary to store all of the books from Firebase
        let books = []
        querySnapshot.forEach( (doc) => {
            let book = doc.data()
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

    const Image = ( props ) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `Book_cover/${ props.path }`)
        getDownloadURL( imgRef ).then( (url) => setImgPath(url) )

        return(
            <Card.Img variant="top" src={imgPath} className="card-image" />
        )
    }

    const Columns = data.map( (book, key) => {
        return(
            <Col md="3" key={key} className='my-3'>
                <Card className='book-card'>
                    <Image path={book.Cover}/>
                    <Card.Body>
                        <Card.Title>{book.Title}</Card.Title>
                    </Card.Body>
                    <a href={"/detail/"+book.id} className='card-link'></a>
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