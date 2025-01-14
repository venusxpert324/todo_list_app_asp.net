import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Context from '../../helpers/contextStore';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Caret from '../../components/Icon/Caret';
import Cookies from 'js-cookie';
import axios from "axios";

function Todo() {
  // initialize
  const navigate = useNavigate();
  const _context = useContext(Context);
  const [todos, setTodos] = useState([]);
  const [todo_id, setTodoId] = useState(0);
  const [deleteAction, setDeleteAction] = useState("");

  // get todo list
  const headers= {
    "Content-Type" : "application/json",
    "Accept" : "application/json",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
    "Authorization":_context.token
  };
  useEffect(()=> {
    if(_context.user == undefined) {
      navigate('/');
    }
    axios.get("http://localhost:8081/api/v1/todos", {headers})
    .then( res=> {
      setTodos(res.data.todo_list);
      setDeleteAction('');
    })
    .catch(err => {
      if(err.code == "ERR_NETWORK") {
        navigate('/');
      }
    });
  }, [deleteAction]);

  // logout
  const handleLogout = () => {    
    axios.post("http://localhost:8081/api/v1/auth/logout", {headers})
    .then(res => {
      console.log("res.data", res.data);
      if(res.data.status == "success") {
        _context.setToken('');
        Cookies.set('token', "");
        navigate('/');
      }
    }).catch(err => console.log(err));
  }

  // edit todo
  const handleEdit = (e, todo_id) => {
    e.preventDefault();
    navigate('/todo/edit/'+todo_id);
  }

  // delete todo
  const handleDelete = (e, todo_id) => {
    e.preventDefault();
    setTodoId(todo_id);
    setShowConfirm(true);
  }
  const handleDeleteFunc = () => {    
    axios.delete("http://localhost:8081/api/v1/todos/"+todo_id, {headers})
    .then(res => {
      setDeleteAction(1);
      setMessage("Todo has been deleted successfully.");
      handleShow();
    })
    .catch(err => console.log("error occured!!!!!"));
  }

  // Alert Modal
    const [show, setShow] = useState(false);
    const [msg, setMessage] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true); 

  // Confirm Modal
    const [show_confirm, setShowConfirm] = useState(false);    
    const handleConfirmClose = () => setShowConfirm(false);
    const handleConfirmOk = () => {
      setShowConfirm(false);
      handleDeleteFunc();
    };   

  // table header
  const table_headers = [
    {key:'id', label:'ID', cls_name: 'min-w-80'},
    {key:'title', label:'Title', cls_name: 'min-w-200'},
    {key:'description', label:'Description', cls_name: 'min-w-80'},
    {key:'status', label:'Status', cls_name: 'min-w-80'},
    {key:'due_date', label:'Date', cls_name: 'min-w-150'},
    {key:'action', label:'Action', cls_name: 'min-w-80'}    
  ];

  // sort
  const [sort, setSort] = useState({
    sort_category:'id', direction:'asc'
  });
  function handleSortClick(_header) {
    setSort({
      sort_category:_header.key,
      direction:_header.key == sort.sort_category ? (sort.direction == 'asc' ? 'desc' : 'asc') : 'desc'
    });
  }
  function getSortedInfo(sort_data) {
    // return sort_data;
    if(sort.direction == "asc") {
      return sort_data.sort((a, b)=> a[sort.sort_category] > b[sort.sort_category] ? 1 : -1);
    }
    return sort_data.sort((a, b)=> a[sort.sort_category] > b[sort.sort_category] ? -1 : 1);
  }

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
      <Modal
        show={show_confirm}
        onHide={handleConfirmClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmOk}>
            Ok
          </Button>
          <Button variant="secondary" onClick={handleConfirmClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="btn-logout-area d-flex align-items-center">        
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
        </svg>
        <span>{_context.user != undefined ? _context.user.username : ''}</span>
        <button className="btn btn-dark" onClick={handleLogout}>Logout</button>
      </div>
      <div className="user-list">
        <p className="app-title">Todo List</p>
        <div className="d-flex justify-content-center">
          <div className="vh-77 col-12 col-xl-8 bg-white rounded p-3">
            <div className="d-flex justify-content-start">
              <Link to="/todo/create" className="btn btn-success">Create +</Link>            
            </div>  
            <div className='vh-66 overflow-x-s'>
              <table className='table'>
                <thead>
                  <tr>
                    {table_headers.map((_header, index)=>{
                      return <th className={_header.cls_name} key={index} onClick={()=>handleSortClick(_header)}>
                        <span>{_header.label}</span>
                        {_header.key == sort.sort_category && _header.key != 'action' && (
                          <Caret direction={sort.direction} />
                        )}                      
                      </th>
                    })}                  
                  </tr>
                </thead>
                <tbody>
                  {
                    todos.length == 0 ? <>
                      <tr>
                        <td colSpan="6">There is no result.</td>
                      </tr>
                    </> : <></>
                  }
                  {getSortedInfo(todos).map((todo, index) => {
                    return <tr key={index}>
                      <td>{todo.id}</td>
                      <td className='max-w-300'>{todo.title}</td>
                      <td className='max-w-300'>{todo.description}</td>
                      <td className={todo.status == 1 ? 'text-success text-align-center' : 'text-danger text-align-center'}>{todo.status == 1 ? 'Completed' : 'Not Completed'}</td>
                      <td className='text-align-center'>{todo.due_date}</td>
                      <td className='text-align-center'>
                        <button className='btn btn-sm btn-primary mx-2' onClick={e=>handleEdit(e, todo.id)}>Edit</button>
                        <button className='btn btn-sm btn-danger' onClick={e=>handleDelete(e, todo.id)}>Delete</button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>                    
          </div>
        </div>        
      </div>      
    </>    
  );
}

export default Todo;
