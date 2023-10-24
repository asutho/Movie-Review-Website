import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardComponent from 'react-bootstrap/Card';

import { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage'

//contexts
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext'

import '../Styles/Home.css'


const CardList = ({ Columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
}

export default CardList;



export function Home () {
    const[ data, setData ] = useState([])

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)

    const getData = async () => {
        //get data from Firebase collections called 'Movies'
        const querySnapshot = await getDocs(collection(FBDb, "Movies"))
        //an arrary to store all of the movies from Firebase
        let movies = [];
        querySnapshot.forEach( (doc) => {
            let movie = doc.data()
            movie.id = doc.id
            //add the movie to the array 
            movies.push(movie)
        })
        //set the movies array as the data state
        setData(movies)
    }
    useEffect( () => {
        if( data.length === 0 ) {
            getData();
        }
    }, []);

    const Image = ( props ) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `Movie_cover/${ props.path }`)
        getDownloadURL( imgRef ).then( (url) => setImgPath(url) )

        return(
            <Card.Img variant="top" src={imgPath} className="card-image" />
        )
    }

    const Columns = data.map( (movie, key) => {
        return(
            <Col md="3" key={key} className='my-3'>
                <Card className='movie-card' style={{background: "rgb(50, 50, 80)", color: "antiquewhite"}} >
                    <Image path={movie.Image}/>
                    <Card.Body>
                        <Card.Title>{movie.Title}</Card.Title>
                        <h6>{movie.Genre}</h6>
                    </Card.Body>
                    <a href={"/detail/"+movie.id} className='card-link'></a>
                </Card>
            </Col>
        )
    })

    return (
        <Container>
            <Row className='intro'>
                <h1>Welcome to <b>MOVIE CLUB</b></h1>
                <p><br/><br/>We have a collection of over 19 movies for you to browse</p>
            </Row>
            <Row>
                {Columns}
            </Row>
        </Container>
    )
}