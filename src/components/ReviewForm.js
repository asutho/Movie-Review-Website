import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import ReactStars from "react-rating-stars-component"
import React from "react";
import Alert from 'react-bootstrap/Alert';


export function ReviewForm(props) {
    const[ stars, setStars ] = useState("")
    const[ submitted, setSubmitted] = useState(false)

    const SubmitHandler = ( event ) => {
        event.preventDefault()
        setSubmitted(true)
        const data = new FormData(event.target)
        const reviewTitle = data.get("title")
        const reviewBody = data.get("body")
        const reviewStars = data.get("stars")
        props.handler({title: reviewTitle, content: reviewBody, stars: reviewStars})
    }

  const SubmitAlert = ( props ) => {
    if( props.show ) {
      return (
        <Alert variant="success">Thanks for your review</Alert>
      )
    }
    else {
      return null
    }
  }
    if( props.user) {
    return(
        <Form onSubmit={ SubmitHandler }>
        <h4>Add a Movie Rating!</h4>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Review Title</Form.Label>
        <Form.Control type="text" placeholder="" name="title"/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Review Content</Form.Label>
        <Form.Control as="textarea" rows={3} name="body"/>
      </Form.Group>
      <Form.Group className="centre"> 
        <Form.Label>You've given this movie {stars} stars</Form.Label>
        <ReactStars count={5} size={60} half={true} value={0} onChange={(newRating) => setStars(newRating)}/>
      </Form.Group>
      <Button  type="submit" className="button" disabled={ (submitted) ? true : false }>Submit Review</Button> 
      
      <SubmitAlert show={ submitted } />
    </Form>
  )
    }
    else {
        return null
    }
}

// variant="outline-dark"
