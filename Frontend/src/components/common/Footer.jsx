import React from "react";

function footer() {
  return (
    <>
      <footer className="bg-gradient-to-r from-green-300 to-lime-200 text-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">KickOnTurf</h3>
            <p className="text-sm">
              Your go-to platform for managing, booking, and scheduling sports
              turfs seamlessly.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
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
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">
              📞 <span className="font-medium">+91-9876543210</span>
            </p>
            <p className="text-sm">
              📧{" "}
              <a
                href="mailto:support@kickonturf.com"
                className="hover:underline"
              >
                support@kickonturf.com
              </a>
            </p>
            <p className="text-sm">📍 123, Turf Street, Mumbai, India</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/facebook-circled--v1.png"
                  alt="Facebook"
                  className="h-8"
                />
              </a>
              <a
                href="https://twitter.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/twitter-circled.png"
                  alt="Twitter"
                  className="h-8"
                />
              </a>
              <a
                href="https://instagram.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/instagram-new.png"
                  alt="Instagram"
                  className="h-8"
                />
              </a>
              <a
                href="https://linkedin.com"
                className="hover:scale-110 transform transition"
              >
                <img
                  src="https://img.icons8.com/color/48/linkedin-circled.png"
                  alt="LinkedIn"
                  className="h-8"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
          <p>© 2025 KickOnTurf. All Rights Reserved.</p>
          <p>
            Built with 💚 by{" "}
            <a href="/" className="text-green-600 hover:underline">
              Your Team
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}

export default footer;
