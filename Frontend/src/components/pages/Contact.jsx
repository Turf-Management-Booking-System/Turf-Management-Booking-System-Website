import React from "react";

const ContactForm = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-lime-200 to-green-400 text-white py-12">
      <div className="flex flex-col md:flex-row gap-16 p-8 w-full max-w-7xl m-14">
        {/* Left Section - Contact Information */}

        <div className="space-y-12 w-full md:w-1/2">
          {/* Address */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-map text-4xl text-black"></i>
            <div>
              <h3 className="text-lg text-black font-semibold">Address</h3>
              <p className="text-black">
                400070 Pipe Road, loremghsgds, Kurla West. Mumbai.
              </p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-phone text-4xl text-black"></i>
            <div>
              <h3 className="text-lg text-black font-semibold">Phone</h3>
              <p className="text-black">000-000-0000</p>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-envelope text-4xl text-black"></i>
            <div>
              <h3 className="text-lg text-black font-semibold">Email</h3>
              <p className="text-black">sknagma5233@gmail.com</p>
            </div>
          </div>
          {/* Business Hours */}
          <div className="flex items-start gap-4">
            <i className="bx bxs-time-five text-4xl text-black"></i>
            <div>
              <h3 className="text-lg text-black font-semibold">
                Business Hours
              </h3>
              <p className="text-black">Monday to Friday: 9 AM - 6 PM</p>
              <p className="text-black">Saturday: 10 AM - 4 PM</p>
            </div>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-xl text-black font-semibold mb-4">
              Connect with us
            </h3>
            <div className="flex gap-6">
              <a href="#" className="text-black">
                <i className="bx bxl-facebook text-3xl"></i>
              </a>
              <a href="#" className="text-black">
                <i className="bx bxl-twitter text-3xl"></i>
              </a>
              <a href="#" className="text-black">
                <i className="bx bxl-instagram text-3xl"></i>
              </a>
              <a href="#" className="text-black">
                <i className="bx bxl-linkedin text-3xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-white rounded-lg p-8 w-full md:w-1/2 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Send Message
          </h2>
          <form className="space-y-8">
            {/* Full Name Input */}
            <div className="relative">
              <input
                type="text"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
              />
              <label
                className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400"
              >
                Full Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
              />
              <label
                className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400"
              >
                Email
              </label>
            </div>

            {/* Message Textarea */}
            <div className="relative">
              <textarea
                rows="6"
                className="peer w-full pt-6 pb-1 bg-transparent border-b-2 border-gray-300 text-gray-800 focus:outline-none focus:border-green-400"
                placeholder=" "
                required
              ></textarea>
              <label
                className="absolute left-0 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-green-400"
              >
                Type your message...
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 rounded"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
