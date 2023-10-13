import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import ReactStars from "react-rating-stars-component"
import React from "react";
import Alert from 'react-bootstrap/Alert';


export function ReviewForm(props) {
    const[ stars, setStars ] = useState(5)
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
      <Form.Group>
        <Form.Label>You've given this movie {stars} stars</Form.Label>
        <Form.Range name="stars" step="0.5" min="1" max="5" value={stars} onChange={ (evt) => setStars(evt.target.value)}/>
      </Form.Group>
      <Button type="submit" variant="primary" disabled={ (submitted) ? true : false }>Submit Rating</Button>
      <SubmitAlert show={ submitted } />
    </Form>
  )
    }
    else {
        return null
    }
}
