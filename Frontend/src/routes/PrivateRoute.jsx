
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { isTokenExpired } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && isTokenExpired()) {
      dispatch(logout());
      navigate("/login"); 
    }
  }, [isAuthenticated, dispatch, navigate]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;