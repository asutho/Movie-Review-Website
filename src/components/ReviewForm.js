import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export function ReviewForm(props) {
    if( props.user) {
    return(
        <Form>
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
