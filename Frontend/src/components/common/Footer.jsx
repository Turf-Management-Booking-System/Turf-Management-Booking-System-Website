import React from "react";

function footer() {
  return (
    <>
      <footer className="bg-[#587990] dark:bg-black text-white py-10 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About Section */}
          <div>
            <h3 className="text-3xl font-orbitron font-bold text-black dark:text-white mb-4">KickOnTurf</h3>
            <p className="text-lg font-poppins">
              Your go-to platform for managing, booking, and scheduling sports
              turfs seamlessly.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold mb-4 font-serifa text-black dark:text-white text-2xl">Quick Links</h4>
            <ul className="space-y-2 text-lg">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-4 text-xl dark:text-white text-black">Contact Us</h4>
            <p className="text-lg">
              📞 <span className="font-medium">+91-9876543210</span>
            </p>
            <p className="text-lg">
              📧{" "}
              <a
                href="mailto:support@kickonturf.com"
                className="hover:underline"
              >
                support@kickonturf.com
              </a>
            </p>
            <p className="text-lg">📍 123, Turf Street, Mumbai, India</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="font-semibold mb-4 dark:text-white text-black text-2xl">Follow Us</h4>
            <div className="flex space-x-4 ">
              <a
                href="https://facebook.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/facebook-circled--v1.png"
                  alt="Facebook"
                  className="h-12"
                />
              </a>
              <a
                href="https://twitter.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/twitter-circled.png"
                  alt="Twitter"
                  className="h-12"
                />
              </a>
              <a
                href="https://instagram.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/instagram-new.png"
                  alt="Instagram"
                  className="h-12"
                />
              </a>
              <a
                href="https://linkedin.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/linkedin-circled.png"
                  alt="LinkedIn"
                  className="h-12"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-lg font-poppins dark:text-white text-black">
          <p>© 2025 KickOnTurf. All Rights Reserved.</p>
          <p>
            Built with 💚 by{" "}
            <a href="/" className="text-white hover:underline">
              Nagma and Shabina
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}

export default footer;
