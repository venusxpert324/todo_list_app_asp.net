import React, {useState, useContext} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Context from '../../helpers/contextStore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const _context = useContext(Context);
  axios.defaults.withCredentials = true;  
  const [values, setValues] = useState({
    email: '',
    password: ''
  });    

  // submit login
  const handleSubmit = (e) => {
    e.preventDefault();

    // remove validation string
    const input_email_obj = document.getElementById('input-email');
    if(input_email_obj.classList.contains('has-error')) {
      input_email_obj.classList.remove('has-error');
    }
    const input_password_obj = document.getElementById('input-password');
    if(input_password_obj.classList.contains('has-error')) {
      input_password_obj.classList.remove('has-error');
    }    

    // call auth login api
    axios.post("http://localhost:8081/api/v1/auth/login", values)
    .then(res => {
      if(res.data.status == "no email") { // email not exists
        if(!input_email_obj.classList.contains('has-error')) {
          input_email_obj.classList.add('has-error');
        }
      } else if(res.data.status == "wrong password") { // wrong password
        if(!input_password_obj.classList.contains('has-error')) {
          input_password_obj.classList.add('has-error');
        }
      } else { // success  
        console.log("success!!!", res.data.token);      
        _context.setToken(res.data.token);
        Cookies.set('token', res.data.token);
        console.log("01");      
        _context.setUser(res.data.user);
        Cookies.set('user', JSON.stringify(res.data.user));
        console.log("02");      
        navigate('/todo');
      }      
    })
    .catch(err => {
      if (err.response.data.message != undefined && err.response.data.message == "Invalid email or password.") {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Unable to connect to the server.");
      }      
      handleShow();
    });
  }  

  // Modal
  const [show, setShow] = useState(false);
  const [msg, setMessage] = useState("");
  const handleClose = () => setShow(false);
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
                <form onSubmit={handleSubmit}>
                  {/* Email input */}
                  <div data-mdb-input-init className="form-outline mb-4" id="input-email">
                    <input type="email" id="form1Example13" className="form-control form-control-lg active" 
                    onChange={e => setValues({...values, email: e.target.value})} required/>
                    <label className="form-label" for="form1Example13">Email address</label>
                    <span className="error-area text-danger">This email doesn't exist.</span>
                  </div>

                  {/* Password input */}
                  <div data-mdb-input-init className="form-outline mb-4" id="input-password">
                    <input type="password" id="form1Example23" className="form-control form-control-lg active" 
                    onChange={e => setValues({...values, password: e.target.value})} required/>
                    <label className="form-label" for="form1Example23">Password</label>
                    <span className="error-area text-danger">This password is wrong.</span>
                  </div>         

                  {/* Submit button */}
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block">Sign in</button>
                  <Link to="/register"><button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block btn-dark">Create Account</button></Link>                
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>    
  );
}

export default Login;
