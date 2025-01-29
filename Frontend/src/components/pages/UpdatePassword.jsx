import React from "react";

const UpdatePassword = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 via-lime-200 to-green-300">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8 mx-4">
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Update Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>
        <form className="flex flex-col space-y-4">
          {/* New Password Input */}
          <div>
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Update Password
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Go back to{" "}
          <a href="/login" className="text-green-600 underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
