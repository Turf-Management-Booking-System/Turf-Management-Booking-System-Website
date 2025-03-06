import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setLoader } from "../slices/authSlice";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loader = useSelector((state) => state.auth.loader);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      dispatch(setLoader(false)); // Set loader to false if authenticated
    }
    setIsCheckingAuth(false); // Mark authentication check as complete
  }, [isAuthenticated, navigate, dispatch]);

  // Show a loading spinner or nothing while checking authentication
  if (isCheckingAuth || loader) {
    return null; // or return a loading spinner
  }

  // Render children only if authenticated
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;