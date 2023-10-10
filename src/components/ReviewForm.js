import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export function ReviewForm(props) {
    const SubmitHandler = ( event ) => {
        event.preventDefault()
        const data = new FormData(event.target)
        const reviewTitle = data.get("title")
        const reviewBody = data.get("body")
        props.handler({title: reviewTitle, content: reviewBody})
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
      <Button type="submit" variant="primary">Submit Rating</Button>
    </Form>
  )
    }
    else {
        return null
    }
}
