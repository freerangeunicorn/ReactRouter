import React, {Component, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import{ Button, Card, Container, Navbar, Nav, FormControl, Form, Row, Col, FormGroup} from 'react-bootstrap';



function Index(props) {
  return(
    <>
    <h2>Home</h2>
    {/* <CardGroup> */}<div className='d-flex justify-content-center' style={{flexWrap: "wrap"}}>
    {props.mapCandidates()}
    </div>
    {/* </CardGroup> */}
</>
  ) 
}

function About() {
  return <h2>About</h2>;
}

function NewUser() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const newCandidate = async () => {
  const newCandidate={first_name:firstName, last_name:lastName, email}
  const config = {
    method: "POST",
    body: JSON.stringify(newCandidate),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
    }
    await fetch(`http://localhost:3001/candidates/`, config)
    window.location.replace('http://localhost:3000/')
  }
  
  return (
  <>
  <h2>Candidates</h2>
  <Form>
    <div className='d-flex'>
      <Form.Control placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />
      <Form.Control placeholder="Last name" onChange={(e) => setLastName(e.target.value)}/>
      </div>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>
  <Button variant="primary" type="submit" onClick={() => newCandidate()}>
    Submit
  </Button>
</Form>
</>
)
}

class Candidate extends Component {
  state =
  {
person:{}
  } 
  componentDidMount(){
    this.onePerson()
  }
 onePerson = async () => {
  const req = await fetch(`http://localhost:3001/candidates${this.props.history.location.pathname}`)
  const data = await req.json()
  this.setState({person :data})
}
putCandidate=async (id) => {
  const config = {
    method: "PUT",
    body: JSON.stringify({
    ...this.state.person,
     first_name: this.state.person.first_name,
  
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }
  await fetch(`http://localhost:3001/candidates/${id}`, config)
 this.onePerson()
}
render(){
  return (
    <>
  <h2>Profile Details</h2>
  {this.state.person.first_name}  {this.state.person.last_name}  {this.state.person.job_title} 
  <Container>
  <Row>
  <form>
  <Col>
  <label>First name</label> <br/>
  <input placeholder='first name' value={this.state.person.first_name} onChange={(e)=>this.setState({person: {...this.state.person, first_name:e.target.value}}, ()=>console.log(this.state.person))}/></Col>
  <Col>
  <label>Last name</label><br/>
  <input placeholder='last name' value={this.state.person.last_name} onChange={(e)=>this.setState({person: {...this.state.person, last_name:e.target.value}}, ()=>console.log(this.state.person))}/></Col>
  <Col>
  <label>Jobtitle</label><br/>
  <input placeholder='job title' value={this.state.person.job_title} onChange={(e)=>this.setState({person: {...this.state.person, job_title:e.target.value}}, ()=>console.log(this.state.person))}/></Col>
  <Col>
  <label>Email</label><br/>
  <input placeholder='email' value={this.state.person.email} onChange={(e)=>this.setState({person: {...this.state.person, email:e.target.value}}, ()=>console.log(this.state.person))}/></Col>
  <button type='submit' onClick={()=> this.putCandidate(this.state.person.id)}>Edit</button>
  </form>
  </Row>
</Container>
  </>
  )
}}

class AppRouter extends Component {
state={
  candidates:[]
}
componentDidMount(){
    this.getCandidates()
  }

 getCandidates= async() =>{
   const request= await fetch("http://localhost:3001/candidates")
   const jsonData=await request.json()
   console.log('wtf', jsonData)
   this.setState({candidates:jsonData})
  
 }

 deleteCandidate=async(id)=> {
   const config = {
    method: "DELETE"
  }
  await fetch(`http://localhost:3001/candidates/${id}`, config)
 this.getCandidates()
 }


mapCandidates = () => {
  console.log('this.state.candidates', this.state.candidates)
  return this.state.candidates.map((candidate)=> {
    return (
      <Card style={{width: '18rem', margin: 10}}>
  <Card.Img variant="top" style={{width:"20%"}}src={candidate.profile_pic_url} />
  <Card.Body>
    <Card.Title>{candidate.first_name} {candidate.last_name} {candidate.id}</Card.Title>
    <Card.Text>
    Title: {candidate.job_title} 
    <br/>
    Company: {candidate.company}
    <br/>
    Email: {candidate.email}
    </Card.Text>
    <Button href={`/${candidate.id}`}>Update details</Button>
    <Button href='#' onClick={()=> this.deleteCandidate(candidate.id)}>DELETE</Button>
  </Card.Body>
</Card>
      )
    }
  )
}

render() {
  return (
      
       <>
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/about">About</Nav.Link>
      <Nav.Link href="/newuser">Add User</Nav.Link>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>
    <Router>
  <Switch>
      <Route path="/" exact component={() => <Index mapCandidates={this.mapCandidates} />} />
      <Route  exact path="/about" component={About} />
      <Route exact path="/newuser" component={NewUser}/>
      <Route exact path="/:id" render={props => <Candidate {...props} />}/>
  </Switch>
  </Router>
  </>
  );
}

}

export default AppRouter;
