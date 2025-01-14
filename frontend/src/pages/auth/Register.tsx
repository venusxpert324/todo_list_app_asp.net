import React, {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

function Reister() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  });  

  // change email
  const handleEmail = (e) => {
    setValues({...values, email: e.target.value});
    const form_obj = document.getElementById('form-user');
    if(form_obj.classList.contains('has-error')) {
      form_obj.classList.remove('has-error');
    }
  }

  // register
  const handleSubmit = (e) => {
    e.preventDefault();

    // remove validation string
    const form_obj = document.getElementById('form-user');
    if(form_obj.classList.contains('has-error')) {
      form_obj.classList.remove('has-error');
    }    

    const formDataToSend = new FormData();
    formDataToSend.append("username", values.username);
    formDataToSend.append("email", values.email);
    formDataToSend.append("password", values.password);

    // call auth register api
    axios.post("http://localhost:8081/api/v1/auth/register", formDataToSend)
    .then(res => {      
      if (res.data.status == "email exists") { // email already exists        
        if(!form_obj.classList.contains('has-error')) {
          form_obj.classList.add('has-error');
        }
      } else { // success        
        setMessage("New user is registered.");
        handleShow();
      }
    })
    .catch(err => {
      console.log("error occured!!!!!", err);
      if (err.response.data.message != undefined && err.response.data.message == "email exists") { // email already exists        
        if(!form_obj.classList.contains('has-error')) {
          form_obj.classList.add('has-error');
        }
      }
    });
  }  

  // Modal
    const [show, setShow] = useState(false);
    const [msg, setMessage] = useState("");
    const handleClose = () => {
      setShow(false);
      navigate('/login');
    };
    const handleShow = () => setShow(true);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="login">
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">            
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1 form-area">
              <form onSubmit={handleSubmit} id="form-user">
                {/* Username input */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" id="form1Example13" className="form-control form-control-lg active" 
                  onChange={e => setValues({...values, username: e.target.value})} required/>
                  <label className="form-label" for="form1Example13">User name</label>
                </div>

                {/* Email input */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="email" id="form1Example13" className="form-control form-control-lg active" 
                  onChange={handleEmail} required/>
                  <label className="form-label" for="form1Example13">Email address</label>
                  <span className="error-area text-danger">This email already exists.</span>
                </div>

                {/* Password input */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="password" id="form1Example23" className="form-control form-control-lg active" 
                  onChange={e => setValues({...values, password: e.target.value})} required/>
                  <label className="form-label" for="form1Example23">Password</label>
                </div>         

                {/* Submit button */}
                <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block">Register</button>
                <Link to="/login"><button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block btn-dark">To Login Page</button></Link>                
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>    
  );
}

export default Reister;
