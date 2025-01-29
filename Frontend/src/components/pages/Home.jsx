import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-solid-svg-icons";

function home() {

  return (
    <>
      <div className="min-h-screen mt-16 bg-deepForestGreen">
        <div
          id="hero-container"
          className="max-w-4xl mx-auto px-6 pb-16 pt-6 flex flex-col sm:pt-3 sm:items-center sm:text-center sm:max-w-2xl"
        >
          <div
            id="version-text"
            className="flex items-center my-6 gap-2 border border-yellow-300 bg-yellow-50 rounded-lg px-3 py-1 w-fit shadow-md hover:shadow-lg hover:-translate-y-1 transition group "
          >
            {/* <div class="w-2 h-2 bg-yellow-400 rounded-full border border-yellow-600"></div> */}
            <p className="font-display font-medium text-red-500 flex items-center group">
              <span className="group-hover:animate-shake">⏰</span> Hurry Up!
              <span className="text-yellow-800">
                {" "}
                Prime Slots Filling Fast !!
              </span>
            </p>
          </div>
          <div id="hero-featues" className=" hidden sm:flex gap-8 my-6">
            <div className="font-orbitron flex justify-center gap-2 items-center text-white ">
              <p>🏟️ Live Turf Availability</p>
            </div>
            <div className="font-orbitron flex justify-center gap-2 items-center text-white">
              <p>💳 Secure Payments</p>
            </div>
            <div className="font-orbitron flex justify-center gap-2 items-center text-white">
              <p>📅 Easy Scheduling</p>
            </div>
          </div>
          <h1 className="font-orbitron text-4xl font-semibold leading-snug mt-4 sm:text-6xl text- #004d0 text-white">
            Manage Your Turf Bookings Seamlessly!
          </h1>
          <p className="font-montserrat text-xl mt-4 sm:text-2xl sm:mt-8 sm:leading-normal text-white">
            Book, manage, and track turf bookings with ease. Perfect for sports
            enthusiasts and administrators. Available across all platforms.
          </p>
          <div
            id="buttons-container"
            className="mt-12 flex gap-4 flex-col sm:flex-row"
          >
            <button className="px-8 py-3 font-semibold rounded-lg text-white bg-green-600 shadow-sm hover:bg-opacity-90">
              Get Started
            </button>
            <button className="px-8 py-3 font-semibold rounded-lg bg-white border border-gray-400 hover:border-gray-800">
              Explore Features
            </button>
          </div>
        </div>

        {/*Section of search,book,play*/}
        <section className="bg-gradient-to-r from-green-100 via-lime-200 to-green-300 py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Card 1 */}
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <img
                    src="https://img.icons8.com/ios-filled/64/search.png"
                    alt="Search Icon"
                    className="h-12 w-12"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search</h3>
                <p className="text-gray-600">
                  Are you looking to play after work, organize your Sunday
                  Five’s football match? Explore the largest network of sports
                  facilities all over India.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <img
                    src="https://img.icons8.com/ios-filled/64/calendar.png"
                    alt="Book Icon"
                    className="h-12 w-12"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book</h3>
                <p className="text-gray-600">
                  Once you’ve found the perfect ground, court, or gym, connect
                  with the venue through the Book Now button to make online
                  booking easy and secure.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <FontAwesomeIcon icon={faFutbol} size="3x" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Play</h3>
                <p className="text-gray-600">
                  You’re the hero—you’ve found a stunning turf or court, booked
                  with ease, and now it’s time to play. The scene is set for
                  your epic match!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*section */}
        <section className="bg-gradient-to-r from-green-100 via-lime-200 to-green-300 py-12">
          <h2 className="text-center text-3xl font-bold text-white mb-8">
            Top Rated Turfs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <img
                src="turf1.jpg"
                alt="Turf 1"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold">Elite Sports Arena</h3>
              <p className="text-gray-700 mt-2">
                Located in Mumbai. Premium turf with lighting and refreshments.
              </p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
                Book Now
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <img
                src="turf2.jpg"
                alt="Turf 2"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold">Pro Sports Hub</h3>
              <p className="text-gray-700 mt-2">
                Located in Pune. Spacious turf for football and cricket.
              </p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
                Book Now
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <img
                src="turf3.jpg"
                alt="Turf 3"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold">Prime Sports Court</h3>
              <p className="text-gray-700 mt-2">
                Located in Delhi. Perfect for indoor basketball and badminton.
              </p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
                Book Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default home;
