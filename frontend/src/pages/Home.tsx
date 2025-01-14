import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Context from '../helpers/contextStore';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

function Home() {
  const navigate = useNavigate();
  const _context = useContext(Context);    

  // swith dark and light mode
  const handleSwitchMode = () => {
    let _mode = _context.mode == "light" ? "dark" : 'light';
    _context.setMode(_mode);
    Cookies.set('mode', _mode);
  }

  return (
    <>
      <div className="App">
        <p className="app-title">Todo List Application</p>                           
        <button className='btn btn-primary' onClick={handleSwitchMode}>{_context.mode == "light" ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</button>             
        <div className='mt-5'>
          <Link to="/login"><button className="btn-login">Login</button></Link>        
        </div>        
    </div>
    </>    
  );
}

export default Home;
