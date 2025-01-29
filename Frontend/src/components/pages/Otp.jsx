import React, { useState } from 'react';

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Handle input change
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  // Handle backspace
  const handleBackspace = (event, index) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];

      // Clear the current box
      newOtp[index] = "";
      setOtp(newOtp);

      // Move focus to the previous input box
      if (event.target.previousSibling) {
        event.target.previousSibling.focus();
      }
    }
  };

  // Handle OTP submission
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Entered OTP: ${otp.join("")}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 via-lime-200 to-green-300">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">Enter OTP</h2>
        <p className="text-gray-600 text-center mb-6">
          Please enter the 6-digit OTP sent to your registered mobile number.
        </p>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Didn't receive the OTP? <button className="text-green-600 underline">Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default Otp;
