import React from 'react';

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg w-full max-w-md">
        <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mb-4">Page Not Found</p>
        <p className="text-lg text-gray-500 mb-6">
          Oops! The page you're looking for doesn't exist. Please check the URL.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
