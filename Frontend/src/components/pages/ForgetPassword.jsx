import React ,{useState}from "react";
import { useNavigate } from "react-router-dom";

    const ForgetPassword = () => {
        const [email, setEmail] = useState("");
        const [isEmailValid, setIsEmailValid] = useState(false);

        const navigate = useNavigate();
      
        // Handle email input change
        const handleEmailChange = (e) => {
          setEmail(e.target.value);
          setIsEmailValid(e.target.value !== "");
        };
      
        // Handle form submission
        const handleSubmit = (e) => {
          e.preventDefault(); 
          if (isEmailValid) {
            navigate('/updatepassword');
          }
        };
      

  return (
    <div className="flex justify-center items-center min-h-screen bg-deepForestGreen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-deepForestGreen text-center mb-4">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to receive a password reset link.
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            onClick={() => handleSubmit}
            className={`bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 ${!isEmailValid ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isEmailValid}
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-green-600 underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;