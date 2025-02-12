import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faSearch, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import TurfImageDay from "../../assets/images/TurfImageDay.jpg";
import TurfImageNight from "../../assets/images/TurfImageNight.jpg";
import { DarkModeContext } from "../../context/DarkModeContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Home() {
  const { darkMode } = useContext(DarkModeContext);
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  return (
    <>
      {/* Hero Section */}
      <motion.div
        style={{
          backgroundImage: `url(${darkMode ? TurfImageNight : TurfImageDay})`,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative min-h-screen mt-16 w-full bg-cover bg-center flex items-center justify-end"
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-11/12 sm:w-1/2 p-8 bg-black bg-opacity-80 text-white rounded-lg shadow-lg mr-4 sm:mr-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center my-4 gap-2 border border-yellow-300 bg-yellow-50 rounded-lg px-3 py-1 w-fit shadow-md hover:shadow-lg hover:-translate-y-1 transition group"
          >
            <p className="font-display font-medium text-red-500 flex items-center group">
              <span className="group-hover:animate-shake">⏰</span> Hurry Up!
              <span className="text-yellow-800"> Prime Slots Filling Fast!!</span>
            </p>
          </motion.div>
          <h1 className="font-orbitron text-3xl sm:text-4xl font-semibold leading-snug">
            Manage Your Turf Bookings Seamlessly!
          </h1>
          <p className="font-montserrat text-lg mt-4 sm:text-xl sm:mt-6">
            Book, manage, and track turf bookings with ease. Perfect for sports
            enthusiasts and administrators. Available across all platforms.
          </p>
          <div className="mt-8 flex gap-4 flex-col sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold rounded-lg text-white bg-green-600 shadow-sm hover:bg-opacity-90"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold rounded-lg bg-white text-black border border-gray-400 hover:border-gray-800"
            >
              Explore Features
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Search, Book, Play Timeline */}
      <section ref={ref} className="py-12 flex flex-col items-center relative">
        <div className="w-1 h-[55rem] absolute left-1/2 transform -translate-x-1/2 bg-gray-900 text-white "></div>
        {[ 
          { icon: faSearch, title: "Search", desc: "Explore the largest network of sports facilities all over India.", position: "left" },
          { icon: faCalendarCheck, title: "Book", desc: "Connect with the venue through the Book Now button to make online booking easy and secure.", position: "right" },
          { icon: faFutbol, title: "Play", desc: "The scene is set for your epic match!", position: "left" }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: item.position === "left" ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 + index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`relative flex items-center justify-${item.position} w-full max-w-6xl my-8`}
          >
            <div className={`w-1/2 p-6 flex ${item.position === "left" ? "justify-end" : "justify-start"}`}>
              <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
                <FontAwesomeIcon icon={item.icon} size="3x" className="mb-4 text-[#587990] animate-bounce" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#587990] rounded-full absolute left-1/2 transform -translate-x-1/2"></div>
          </motion.div>
        ))}
      </section>
    </>
  );
}

export default Home;
