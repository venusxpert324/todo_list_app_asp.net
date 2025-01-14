import React, { useState } from 'react';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Todo from './pages/todo/Todo';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Create from './pages/todo/Create';
import RedirectPage from './pages/RedirectPage';
import Container from 'react-bootstrap/Container';
import Context from './helpers/contextStore';
import Cookies from 'js-cookie';
import './App.css';

function App() {  
  const _token = Cookies.get('token');
  const _user = Cookies.get('user');
  const _mode = Cookies.get('mode');  
  const [token, setToken] = useState(_token);  
  const [mode, setMode] = useState(_mode != undefined ? _mode : 'dark');  
  const [user, setUser] = useState(_user != undefined ? JSON.parse(_user) : _user);  
  const value = {token, setToken, user, setUser, mode, setMode};  

  return (
    <>
      <Context.Provider value={value}>
        <Container className={mode == "dark" ? "vh-100 bg-dark text-light" : "vh-100"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={user ? <Todo /> : <RedirectPage />} />
            <Route path="/todo/create" element={user ? <Create /> : <RedirectPage />} />
            <Route path="/todo/edit/:id" element={user ? <Create /> : <RedirectPage />} />
            <Route path="/login" element={<Login />} />            
            <Route path="/register" element={<Register />} />            
          </Routes>
        </Container>
      </Context.Provider>         
    </>    
  );
}

export default App;
