import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { ReviewForm } from '../components/ReviewForm';

import { useParams } from 'react-router-dom';

import { useContext, useState, useEffect } from 'react';
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext';
import { AuthContext } from '../contexts/AuthContext'
import { FBAuthContext } from '../contexts/FBAuthContext';

import { doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function Detail( props ) {
    const[ bookData, setBookData ] = useState()
    const[ auth, setAuth ] = useState()
    const[ bookReviews, setBookReviews ] = useState([])

    let { bookId } = useParams()

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)
    const FBAuth = useContext(FBAuthContext)

    onAuthStateChanged( FBAuth, (user) => {
        if(user) {
            //user is sign in
            setAuth(user)
        }
        else {
            //user is not signed in
            setAuth(null)
        }
    })
 
    const getReviews = async () => {
        const path = `Books/${bookId}/reviews`
        const querySnapshot = await getDocs(collection(FBDb, path))
        let reviews = []
        querySnapshot.forEach( (item) => {
            let review = item.data()
            review.id = item.id
            reviews.push(review)
        })
        setBookReviews(reviews)
    }
    //reviews collection
    const ReviewCollection = bookReviews.map((item) => {
        return (
            <Col md="3">
                <Card>
                    <Card.Title>
                        <h5>{item.title}</h5>
                    </Card.Title>
                    <Card.Text>
                        <p>{item.content}</p>
                    </Card.Text>
                </Card>
            </Col>
        )
    })

    const bookRef = doc( FBDb, "Books", bookId)
    const getBook = async () => {
       let book = await getDoc( bookRef )
       if( book.exists() ) {
        setBookData( book.data() )
        getReviews()
       }
       else {
        // no book exists with the ID
       }
    }

    useEffect(() => {
        if( !bookData ) {
            getBook( bookId )
        }
    })

    //function to handle review submission
    const ReviewHandler = async (reviewData) => {
    //create a document inside Firestore
    const path = `Books/${bookId}/reviews`
    const review = await addDoc(collection(FBDb, path), reviewData)
    }

    const Image = ( props ) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `Book_cover/${ props.path }`)
        getDownloadURL( imgRef ).then( (url) => setImgPath(url) )

        return(
            <img src={imgPath} className='img-fluid'/>
        )
    }

    if( bookData) {
    return(
        <Container>
            <Row>
                <Col md="5">
                <Image path ={bookData.Cover}/>
                </Col>
                <Col md="7">
                    <h2>{bookData.Title}</h2>
                    <h4>{bookData.Author}</h4>
                    <h5>{bookData.Year}</h5>
                    <p>{bookData.Summary}</p>
                    <p>ISBN: {bookData.isbn10} <br/> ISBN13: {bookData.isbn13} </p>
                    <p>Pages: {bookData.Pages}</p>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                <ReviewForm user={auth} handler={ReviewHandler}/>

                </Col>
            </Row>
            <Row>
                <Col>
                {ReviewCollection}
                </Col>
            </Row>
        </Container>
    )}
    else {
        <Container>
        <Row>
            <Col>Loading...</Col>
        </Row>
    </Container>     
    }   
}