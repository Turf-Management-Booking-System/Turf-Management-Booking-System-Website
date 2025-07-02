import { useContext, useEffect, useState } from "react"
import { motion, useScroll, useTransform, } from "framer-motion"
import { DarkModeContext } from "../../context/DarkModeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch } from "react-redux"
import { setLoader } from "../../slices/authSlice"
import logo from "../../assets/Images/Logo.png";
import toast from "react-hot-toast"
import axios from "axios"
import {
  faUsers,
  faTrophy,
  faHandshake,
  faLeaf,
  faMapMarkedAlt,
  faCalendarCheck,
  faChartLine,
  faQuoteLeft,
  faArrowRight,
  faFutbol, faBaseballBatBall, faTableTennisPaddleBall, faFootball, faHockeyPuck, faVolleyball,
  faMedal,
  faBullhorn,
  faLightbulb,
  faHeart,
  faGlobe,
  faRocket,
} from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import blackBg from "../../assets/Images/blackBg.png"
import whiteBg from "../../assets/Images/whiteBg.png"
import greenBg from "../../assets/Images/greenBg.png"
import ladyPic from "../../assets/Images/ladypic.jpg"
import boyPic from "../../assets/Images/boypic.jpg"
import sabina from "../../assets/Images/sabina.jpg"
import nagma from "../../assets/Images/nagma.jpg"

const About = () => {
  const { darkMode } = useContext(DarkModeContext)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])
  const dispatch = useDispatch();
  const [feedBack,setFeedBack] = useState([])
  
  // Team members data
  const teamMembers = [
    {
      name: "Sabina Shaikh",
      role: "Founder & CEO",
      image: sabina,
      bio: "Former professional footballer with a passion for making sports accessible to everyone.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Sarah Chen",
      role: "Operations Director",
      image: boyPic,
      bio: "10+ years experience in sports facility management and customer service excellence.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Nagma Shaikh",
      role: "Tech Lead",
      image: nagma,
      bio: "Software engineer who loves building innovative solutions for sports enthusiasts.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Maria Rodriguez",
      role: "Marketing Head",
      image: ladyPic,
      bio: "Creative strategist with a background in sports marketing and community engagement.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
  ]

  // Company values
  const values = [
    {
      icon: faUsers,
      title: "Community",
      description: "Building connections through sports and shared experiences.",
      color: "bg-purple-500",
    },
    {
      icon: faTrophy,
      title: "Excellence",
      description: "Providing top-quality facilities and service for every player.",
      color: "bg-blue-500",
    },
    {
      icon: faHandshake,
      title: "Integrity",
      description: "Honest, transparent operations in everything we do.",
      color: "bg-green-500",
    },
    {
      icon: faLeaf,
      title: "Sustainability",
      description: "Eco-friendly practices in all our turf facilities.",
      color: "bg-teal-500",
    },
    {
      icon: faHeart,
      title: "Passion",
      description: "Deep love for sports that drives everything we do.",
      color: "bg-red-500",
    },
    {
      icon: faLightbulb,
      title: "Innovation",
      description: "Constantly improving our services with new ideas.",
      color: "bg-yellow-500",
    },
  ]

  // Stats
  const stats = [
    { icon: faMapMarkedAlt, value: "50+", label: "Locations", color: "from-blue-400 to-blue-600" },
    { icon: faUsers, value: "10,000+", label: "Happy Players", color: "from-green-400 to-green-600" },
    { icon: faCalendarCheck, value: "25,000+", label: "Bookings", color: "from-purple-400 to-purple-600" },
    { icon: faChartLine, value: "95%", label: "Satisfaction Rate", color: "from-red-400 to-red-600" },
  ]

  // Timeline events
  const timelineEvents = [
    {
      year: "2015",
      title: "The Beginning",
      description: "Started with a single turf in Mumbai with a vision to revolutionize sports booking.",
      icon: faRocket,
      color: "bg-blue-500",
    },
    {
      year: "2017",
      title: "Digital Transformation",
      description: "Launched our first online booking platform to simplify the reservation process.",
      icon: faGlobe,
      color: "bg-green-500",
    },
    {
      year: "2019",
      title: "Expansion Phase",
      description: "Expanded to 15 cities across India with 30+ premium turf locations.",
      icon: faMapMarkedAlt,
      color: "bg-purple-500",
    },
    {
      year: "2021",
      title: "Community Focus",
      description: "Initiated sports programs for underprivileged children across our locations.",
      icon: faUsers,
      color: "bg-orange-500",
    },
    {
      year: "2023",
      title: "Today",
      description: "Leading the industry with innovative technology and exceptional playing experiences.",
      icon: faTrophy,
      color: "bg-red-500",
    },
  ]

  // Awards and recognition
  const awards = [
    {
      year: "2018",
      title: "Best Sports Startup",
      organization: "India Sports Business Awards",
      icon: faMedal,
    },
    {
      year: "2019",
      title: "Customer Excellence Award",
      organization: "National Customer Service Association",
      icon: faUsers,
    },
    {
      year: "2021",
      title: "Digital Innovation in Sports",
      organization: "Tech & Sports Summit",
      icon: faLightbulb,
    },
    {
      year: "2022",
      title: "Sustainability Champion",
      organization: "Green Business Alliance",
      icon: faLeaf,
    },
  ]

  // Sports we support
  const sports = [
    { name: "Football", icon: faFutbol, color: "bg-green-500" },
    { name: "Cricket", icon: faBaseballBatBall, color: "bg-blue-500" },
    { name: "Badminton", icon: faTableTennisPaddleBall, color: "bg-orange-500" },
    { name: "Rugby", icon: faFootball, color: "bg-yellow-500" },
    { name: "Hockey", icon: faHockeyPuck, color: "bg-red-500" },
    { name: "Volleyball", icon: faVolleyball, color: "bg-purple-500" },
  ]
  const fetchFeedBack = async () => {
    try {
      dispatch(setLoader(true));
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/comment/displayFeedBack`
      );
      if (response.data.success) {
        dispatch(setLoader(false))
        // Convert the single feedback object to an array with one element
        setFeedBack(response.data.feedBack ? [response.data.feedBack] : []);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("error while displaying feedback")
      setFeedBack([]); // Set to empty array on error
    } finally {
      dispatch(setLoader(false));
    }
  };
  useEffect(()=>{
     fetchFeedBack()
  },[])
  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
      }}
      className="min-h-screen pt-16 transition-colors duration-300"
    >

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.istockphoto.com/id/2013078894/photo/soccer-field-sideline-at-sunny-day-summer-day-at-sports-field-sunlight-in-the-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=tnph3eIMZEpcxbNHqrpbnLcFzsacTtc4DlgYK_-HsCs="
            alt="Turf"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-200 dark:bg-black opacity-30 dark:opacity-70 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-2">
                <img
                        src={logo}
                        alt="Logo"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover text-5xl text-gradient bg-gradient-to-r from-green-600 to-blue-500"
                      />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-green-600 dark:text-white mb-6 font-orbitron"
          >
            Our <span className="text-transparent bg-clip-text bg-white dark:bg-green-400">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-black dark:text-white max-w-3xl mx-auto font-montserrat"
          >
            We simplify the way players find and book turfs. Whether you're a casual player or a pro, we make booking easy, fast, and hassle-free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <Link
              to="/turf"
              className="inline-block px-8 py-4 rounded-full bg-[#5886a7] bg-opacity-90 border border-black dark:bg-green-600 dark:border-white  text-white font-bold text-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Explore Our Turfs
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Mission Statement with Animated Background */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"></div>

          {/* Animated circles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-green-300 to-blue-300 dark:from-green-600 dark:to-blue-600 opacity-20"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 text-center backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
          >
            <div className="inline-block mb-6 p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
              <FontAwesomeIcon icon={faBullhorn} className="text-3xl text-white" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Our Mission
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
              At TurfBook, we're on a mission to make sports accessible to everyone by simplifying the process of
              finding and booking quality playing fields. We believe that every sports enthusiast deserves a seamless
              booking experience and access to premium facilities, regardless of their location or skill level.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-full">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500 mr-2" />
                <span className="text-gray-800 dark:text-gray-200">For Everyone</span>
              </div>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-full">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="text-green-500 mr-2" />
                <span className="text-gray-800 dark:text-gray-200">Play from anywhere</span>
              </div>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-full">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-purple-500 mr-2" />
                <span className="text-gray-800 dark:text-gray-200">Easy Booking</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sports We Support */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium text-sm mb-4">
              VERSATILE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Sports We Support</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our facilities are designed to accommodate a wide range of sports activities
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden text-center group"
              >
                <div
                  className={`${sport.color} h-24 flex items-center justify-center group-hover:h-28 transition-all duration-300`}
                >
                  <FontAwesomeIcon icon={sport.icon} className="text-4xl text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{sport.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline - Redesigned */}
      <section
        style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
        }}
        className="py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-medium text-sm mb-4">
              OUR HISTORY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Our Journey</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              From a single turf to a nationwide network, here's how we've grown over the years
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>

            {/* Timeline events */}
            <div className="space-y-12 md:space-y-0">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 50,
                  }}
                  viewport={{ once: true }}
                  className={`relative md:flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } mb-12`}
                >
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className={`${event.color} w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900`}
                    >
                      <FontAwesomeIcon icon={event.icon} className="text-white" />
                    </div>
                  </div>

                  <div className="md:w-1/2"></div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:w-5/12 ${
                      index % 2 === 0 ? "md:mr-10" : "md:ml-10"
                    } border border-gray-200 dark:border-gray-700`}
                  >
                    <div className="flex md:hidden items-center mb-4">
                      <div className={`${event.color} w-10 h-10 rounded-full flex items-center justify-center mr-4`}>
                        <FontAwesomeIcon icon={event.icon} className="text-white" />
                      </div>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        {event.year}
                      </span>
                    </div>

                    <div className="hidden md:block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                      {event.year}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - Redesigned */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
              OUR PRINCIPLES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group"
              >
                <div className={`${value.color} h-2 group-hover:h-4 transition-all duration-300`}></div>
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                    <FontAwesomeIcon icon={value.icon} className={`text-2xl ${value.color.replace("bg-", "text-")}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Redesigned */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?stadium')] bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 text-center border border-white border-opacity-20"
              >
                <div className="inline-block mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto`}
                  >
                    <FontAwesomeIcon icon={stat.icon} className="text-3xl text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-gray-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards and Recognition */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 font-medium text-sm mb-4">
              RECOGNITION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Awards & Achievements</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by the industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="inline-block p-4 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mb-4">
                  <FontAwesomeIcon icon={award.icon} className="text-2xl" />
                </div>
                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">{award.year}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{award.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{award.organization}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-medium text-sm mb-4">
              OUR PEOPLE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Meet Our Team</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind KickOnTurf
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-green-400 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
  <div className="absolute inset-0 bg-blue-300 dark:bg-gray-700 opacity-90"></div>
  <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?football,match')] bg-cover bg-center mix-blend-overlay"></div>

  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {feedBack.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 text-center backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 mb-8"
      >
        <FontAwesomeIcon icon={faQuoteLeft} className="text-5xl text-blue-500 dark:text-blue-400 mb-6 opacity-30" />
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
          {item.thought}
        </p>
        <div className="flex items-center justify-center">
          <img
            src={item.user.image || "https://source.unsplash.com/100x100/?portrait"} // fallback image
            alt=""
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 mr-4"
          />
          <div className="text-left">
            <p className="font-bold text-xl text-gray-900 dark:text-white">{item.user.firstName}{item.user.lastName}</p>
            <p className="text-blue-600 dark:text-blue-400">{item.user.role || "User"}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-[#5886a7]"></div>
            <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?football,stadium')] bg-cover bg-center opacity-20"></div>

            <div className="relative z-10 p-8 md:p-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold mb-6 text-white"
              >
                Ready to Experience the Difference?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-white opacity-90 max-w-3xl mx-auto mb-8"
              >
                Join thousands of sports enthusiasts who've discovered the perfect turf for their game.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/turf"
                  className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-full shadow-lg hover:bg-blue-50 transition duration-300 transform hover:scale-105"
                >
                  Book a Turf Now
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}



export default About

