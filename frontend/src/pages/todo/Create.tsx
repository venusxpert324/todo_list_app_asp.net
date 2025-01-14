import React, {useState, useContext, useEffect} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Context from '../../helpers/contextStore';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

function Create() {
  const {id} = useParams();  
  const navigate = useNavigate();
  const _context = useContext(Context);  
  axios.defaults.withCredentials = true;
  const headers= {
    "Content-Type" : "application/json",
    "Accept" : "application/json",
    "Authorization":_context.token
  };
  const [values, setValues] = useState({
    token: _context.token,
    id: 0,
    title: '',
    description: '',
    status: 2,
    due_date: ''
  });  

  // get todo info   
  useEffect(()=> {
    if(id != undefined && id != '') {
      axios.get("http://localhost:8081/api/v1/todos/find/"+id, {headers})
      .then( res=> {
        if(res.data.todo != undefined) {
          setValues({
            token: _context.token,
            id: res.data.todo.id,
            title: res.data.todo.title,
            description: res.data.todo.description,
            status: res.data.todo.status,
            due_date: res.data.todo.due_date
          });
        }          
      })
      .catch(err => console.log(err));
    }    
  }, []);  

  // call create or update api
  const handleSubmit = (e) => {
    const formDataToSend = new FormData();
    formDataToSend.append("token", values.token);
    formDataToSend.append("id", values.id);
    formDataToSend.append("title", values.title);
    formDataToSend.append("description", values.description);
    formDataToSend.append("status", values.status);
    formDataToSend.append("due_date", values.due_date);

    e.preventDefault();
    axios.post("http://localhost:8081/api/v1/todos", formDataToSend)
    .then(res => {
      let _msg = "New todo has been created successfully.";
      if(id != undefined && id != '') {
        _msg = "Todo has been updated successfully.";
      }
      setMessage(_msg);   
      handleShow();      
    })
    .catch(err => {
      console.log("error occured!", err.response.data);
    });
  } 

  // cancel
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/todo');
    
  }  

  // Modal
  const [show, setShow] = useState(false);
  const [msg, setMessage] = useState("");
  const handleClose = () => {
    setShow(false);
    navigate('/todo');
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
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="col-12 col-sm-6 bg-white rounded p-3">
          <form onSubmit={handleSubmit}>
            <h2 className='text-dark'>{id != undefined && id != '' ? 'Edit Todo' : 'Add Todo'}</h2>
            <div className='mb-2'>
              <label className='text-dark' htmlFor="">Title</label>
              <input type="text" placeholder='Enter Title' className='form-control' onChange={e => setValues({...values, title: e.target.value})} value={values.title} required/>
            </div>
            <div className='mb-2'>
              <label className='text-dark' htmlFor="">Description</label>
              <textarea placeholder='Enter Description' className='form-control' onChange={e => setValues({...values, description: e.target.value})} value={values.description} required/>
            </div>
            <div className='mb-2'>
              <label className='text-dark' htmlFor="">Status</label>
              <select className="form-select" aria-label="Default select example" onChange={e => setValues({...values, status: e.target.value})}>              
                {values.status == 1 ? <option value="1" selected>Completed</option> : <option value="1">Completed</option> }
                {values.status == 2 ? <option value="2" selected>Not Complete</option> : <option value="2">Not Complete</option> }                  
              </select>
            </div>
            <div className='mb-2'>
              <label className='text-dark' htmlFor="">Date</label>
              <input type="date" placeholder='Enter Description' className='form-control' onChange={e => setValues({...values, due_date: e.target.value})} value={values.due_date} required/>
            </div>
            <button className="btn btn-success">Submit</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </form>
        </div>
      </div>
    </>    
  );
}

export default Create;
