import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function RedirectPage() {
  const navigate = useNavigate();  
  useEffect(() => {
    navigate('/');
  }, []);

  return (<></>);
}

export default RedirectPage;
