
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  
    if (isAuthenticated ) {
      navigate("/login"); 
    }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;