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
    const[ movieData, setMovieData ] = useState()
    const[ auth, setAuth ] = useState()
    const[ movieReviews, setMovieReviews ] = useState([])

    let { movieId } = useParams()

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
        const path = `Movies/${movieId}/reviews`
        const querySnapshot = await getDocs(collection(FBDb, path))
        let reviews = []
        querySnapshot.forEach( (item) => {
            let review = item.data()
            review.id = item.id
            reviews.push(review)
        })
        setMovieReviews(reviews)
    }
    //reviews collection
    const ReviewCollection = movieReviews.map((item) => {
        return (
            <Col md="8" offset className='Review'>
                <Card>
                    <Card.Title>
                        <h5>{item.title}</h5>
                    </Card.Title>
                    <Card.Text>
                        <p>{item.content}</p>
                        <p>{item.stars} stars</p>
                    </Card.Text>
                </Card>
            </Col>
        )
    })

    const movieRef = doc( FBDb, "Movies", movieId)
    const getMovie = async () => {
       let movie = await getDoc( movieRef )
       if( movie.exists() ) {
        setMovieData( movie.data() )
        getReviews()
       }
       else {
        // no movie exists with the ID
       }
    }

    useEffect(() => {
        if( !movieData ) {
            getMovie( movieId )
        }
    })

    //function to handle review submission
    const ReviewHandler = async (reviewData) => {
    //create a document inside Firestore
    const path = `Movies/${movieId}/reviews`
    const review = await addDoc(collection(FBDb, path), reviewData)
    //when the user submits a new reivew, refresh the reviews
    getReviews()
    }

    const Image = ( props ) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `Movie_cover/${ props.path }`)
        getDownloadURL( imgRef ).then( (url) => setImgPath(url) )

        return(
            <img src={imgPath} className='img-fluid'/>
        )
    }

    if( movieData) {
    return(
        <Container>
            <Row className='my-3'>
                <Col md="6">
                <Image path ={movieData.Image}></Image><br/>
                    <h2>{movieData.Title}</h2>
                    <h5>{movieData.Genre}</h5>
                    <h4>Director: {movieData.Director}</h4>
                    <h5>Producer: {movieData.Producer}</h5>
                    <p>Synopsis:<br/>{movieData.Synopsis}</p>
                    <p>Starring: {movieData.Actors}</p>
                    <a href={movieData.Link}>View the IMDB page for {movieData.Title} here</a>
                </Col>
                <Col md="5" className='my-3'>
                    <ReviewForm user={auth} handler={ReviewHandler}/>
                    <br/>
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