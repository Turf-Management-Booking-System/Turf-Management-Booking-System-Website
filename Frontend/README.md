import { useContext, useState, useEffect, useCallback, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { HiStar, HiChevronLeft, HiChevronRight } from "react-icons/hi"
import blackBg from "../../assets/Images/blackBg.png"
import greenBg from "../../assets/Images/greenBg.png"
import {
  faFutbol,
  faSearch,
  faCalendarCheck,
  faArrowRight,
  faChevronDown,
  faStar,
  faEnvelope,
  faMapMarkerAlt,
  faUsers,
  faCheckCircle,
  faLightbulb,
  faShieldAlt,
  faBasketballBall,
  faTableTennis,
  faVolleyballBall,
  faHockeyPuck,
  faQuoteLeft,
  faQuoteRight,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import TurfImageDay from "../../assets/images/TurfImageDay.jpg"
import TurfImageNight from "../../assets/images/TurfImageNight.jpg"
import { DarkModeContext } from "../../context/DarkModeContext"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"
import whiteBg from "../../assets/Images/whiteBg.png"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setLoader } from "../../slices/authSlice"
import axios from "axios"
import toast from "react-hot-toast"
import { loadNotification, setNotification } from "../../slices/notificationSlice"

function Home() {
  const dispatch = useDispatch()
  const { darkMode } = useContext(DarkModeContext)
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 })
  const [openIndex, setOpenIndex] = useState(null)
  const [email, setEmail] = useState("")
  const [testimonials, setTestimonials] = useState([])
  const notifications = useSelector((state) => state.notification.notifications)
  const user = useSelector((state) => state.auth.user)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const [showAds, setShowAds] = useState(false)

  //advertisement
  const advertisements = [
    {
      title: "20% OFF First Booking",
      description: "Use code FIRSTPLAY20",
      image:"https://plus.unsplash.com/premium_photo-1664302485296-b418956357e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm9vdGJhbGwlMjBmZWlsZCUyMHBsYXllcnMlMjBwbGF5aW5nJTIwdmVydGljYWwlMjBwdWN8ZW58MHx8MHx8fDA%3D",
      link: "#",
      color: "bg-green-400 bg-opacity-90",
    },
    {
      title: "Weekend Special",
      description: "Book 2 hours, get 1 hour free!",
      image: "https://plus.unsplash.com/premium_photo-1684888778856-c6f2795e3c14?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHVyZnxlbnwwfHwwfHx8MA%3D%3D",
      link: "#",
      color: "bg-green-400 bg-opacity-90",
    },
    {
      title: "Corporate Packages",
      description: "Special rates for team events",
      image: "https://plus.unsplash.com/premium_photo-1721963697019-ba3bde7be788?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNyaWNrZXQlMjBmZWlsZHxlbnwwfHwwfHx8MA%3D%3D",
      link: "#",
      color: "bg-green-400 bg-opacity-90",
    },
  ]

  // Auto rotate ads
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [advertisements.length])

  // Showing ads after hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && contentRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowAds(heroBottom < 0)
        setShowScrollTop(window.scrollY > 500)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Side Advertisement Component
  const SideAdvertisement = ({ ad, position }) => (
    <motion.div
      initial={{ opacity: 0, x: position === "left" ? -100 : 100 }}
      animate={{ opacity: showAds ? 1 : 0, x: showAds ? 0 : position === "left" ? -100 : 100 }}
      transition={{ duration: 0.5 }}
      className={`hidden lg:block fixed ${position === "left" ? "left-0" : "right-0"} top-[30%] transform -translate-y-1/2 w-64 h-[500px] z-10 overflow-hidden rounded-lg shadow-xl`}
      style={{ display: showAds ? "block" : "none" }}
    >
      <div className={`absolute inset-0 ${ad.color} opacity-90`}></div>
      <img
        src={ad.image || "/placeholder.svg"}
        alt={ad.title}
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{ad.title}</h3>
        <p className="mb-4">{ad.description}</p>
        <Link
          to={ad.link}
          className="px-4 py-2 bg-white text-green-700 rounded-full font-bold hover:bg-opacity-90 transition-all text-center"
        >
          Claim Now
        </Link>
      </div>
    </motion.div>
  )

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const timelineItems = [
    {
      icon: faSearch,
      title: "Search",
      desc: "Explore the largest network of sports facilities all over India.",
      position: "left",
      color: "bg-green-600",
    },
    {
      icon: faCalendarCheck,
      title: "Book",
      desc: "Connect with the venue through the Book Now button to make online booking easy and secure.",
      position: "right",
      color: "bg-green-700",
    },
    {
      icon: faFutbol,
      title: "Play",
      desc: "The scene is set for your epic match!",
      position: "left",
      color: "bg-green-800",
    },
  ]

  const faqs = [
    {
      question: "How do I book a turf?",
      answer:
        "You can easily book a turf by searching for available slots, selecting your preferred time, and completing the booking process online.",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before the scheduled time for a full refund.",
    },
    {
      question: "What types of sports can I play?",
      answer:
        "Our turfs are suitable for various sports including football, cricket, tennis, and more. Check individual turf details for specific sport options.",
    },
    {
      question: "Do I need to create an account to book a turf?",
      answer: "Yes, creating an account helps you manage your bookings, check availability, and receive updates.",
    },
    {
      question: "How do I check my booking details?",
      answer: "You can check your booking details in the 'My Bookings' section of your account",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, credit/debit cards, net banking, and cash payments at selected locations.",
    },
    {
      question: "What are the rules for using the turf?",
      answer:
        "Users must wear proper sports footwear, avoid littering, and respect the time slot allotted to them. We have provided rules on each specific turf thats need to be follow",
    },
    {
      question: "How do I contact customer support?",
      answer: "To reach us go through contact page ,you can send mail,you can call on given number",
    },
  ]

  // Enhanced featured turfs with more details
  const featuredTurfs = [
    {
      id: 1,
      name: "Green Valley Turf",
      location: "Mumbai",
      pricePerHour: "1500",
      rating: 4.8,
      image: "https://source.unsplash.com/800x600/?football,turf",
      amenities: ["Floodlights", "Changing Rooms", "Parking"],
      sports: ["Football", "Cricket"],
      category: "premium",
    },
    {
      id: 2,
      name: "City Central Arena",
      location: "Delhi",
      pricePerHour: "1400",
      rating: 4.2,
      image: "https://source.unsplash.com/800x600/?sports,field",
      amenities: ["Refreshments", "Seating Area", "WiFi"],
      sports: ["Football", "Basketball"],
      category: "standard",
    },
    {
      id: 3,
      name: "Sunset Sports Complex",
      location: "Bangalore",
      rating: 4.5,
      pricePerHour: "1100",
      image: "https://source.unsplash.com/800x600/?stadium,sports",
      amenities: ["Shower", "Lockers", "First Aid"],
      sports: ["Cricket", "Tennis"],
      category: "budget",
    },
    {
      id: 4,
      name: "Riverside Turf",
      location: "Pune",
      pricePerHour: "1300",
      rating: 4.6,
      image: "https://source.unsplash.com/800x600/?soccer,field",
      amenities: ["Floodlights", "Refreshments", "Parking"],
      sports: ["Football", "Hockey"],
      category: "premium",
    },
    {
      id: 5,
      name: "Mountain View Arena",
      location: "Shimla",
      pricePerHour: "1600",
      rating: 4.9,
      image: "https://source.unsplash.com/800x600/?sports,ground",
      amenities: ["Changing Rooms", "Seating Area", "Cafe"],
      sports: ["Football", "Basketball", "Volleyball"],
      category: "premium",
    },
    {
      id: 6,
      name: "Urban Play Zone",
      location: "Chennai",
      pricePerHour: "900",
      rating: 4.0,
      image: "https://source.unsplash.com/800x600/?turf,game",
      amenities: ["Basic Facilities", "Water Cooler"],
      sports: ["Football", "Cricket"],
      category: "budget",
    },
  ]

  // Filter turfs by category
  const filteredTurfs =
    activeCategory === "all"
      ? featuredTurfs.slice(0, 3)
      : featuredTurfs.filter((turf) => turf.category === activeCategory).slice(0, 3)

  // Sports categories
  const sportsCategories = [
    { name: "Football", icon: faFutbol, color: "bg-[#5886a7]" },
    { name: "Cricket", icon: faFutbol, color: "bg-[#5886a7]" },
    { name: "Volleyball", icon: faVolleyballBall, color: "bg-[#5886a7]" },
    { name: "Hockey", icon: faHockeyPuck, color: "bg-[#5886a7]" },
  ]

  // Benefits section
  const benefits = [
    {
      icon: faCheckCircle,
      title: "Easy Booking",
      description: "Book your preferred turf in just a few clicks",
      color: "bg-green-600",
    },
    {
      icon: faShieldAlt,
      title: "Secure Payments",
      description: "Multiple secure payment options available",
      color: "bg-green-700",
    },
    {
      icon: faLightbulb,
      title: "Smart Recommendations",
      description: "Get personalized turf suggestions based on your preferences",
      color: "bg-green-600",
    },
  ]

  const fetchAllTestimonials = useCallback(async () => {
    try {
      dispatch(setLoader(true))
      const url = "http://localhost:4000/api/v1/comment/getCommentWithTestimonals"

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      console.log("fetch the testimonals", response.data.testimonals)
      if (response.data.success) {
        setTestimonials(response.data.testimonals)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while fetching testimonials!")
      console.log(error.response?.data?.message)
    } finally {
      dispatch(setLoader(false))
    }
  }, [dispatch])

  useEffect(() => {
    fetchAllTestimonials()
  }, [fetchAllTestimonials])

  const [index, setIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const prevTestimonials = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const nextTestimonials = () => {
    setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoader(true))
      const response = await axios.post(
        `http://localhost:4000/api/v1/auth/subscription`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )
      console.log("response", response.data.success)

      if (response.data.success) {
        toast.success(response?.data?.message)
        if (user?._id) {
          dispatch(loadNotification())
          try {
            const notificationResponse = await axios.get(
              `http://localhost:4000/api/v1/notify/getNotifications/${user._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  withCredentials: true,
                },
              },
            )
            if (notificationResponse.data.success) {
              console.log("fetch notification", notificationResponse.data.currentMessage)
              dispatch(setNotification(notificationResponse.data.currentMessage || []))
              localStorage.setItem("userNotification", JSON.stringify(notificationResponse.data.currentMessage || []))
              console.log("notifications state", notifications)
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Something Went Wrong in fetching notifications!")
            console.log(error.response?.data?.message)
          }
        }

        setEmail("")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error While Subscribing!")
      console.error("Error:", error.response?.data?.message)
    } finally {
      dispatch(setLoader(false))
    }
    setEmail("")
  }

  return (
    <>
      {/* Side Advertisements - only shown after scrolling past hero */}
      <AnimatePresence mode="wait">
        {showAds && (
          <>
            <SideAdvertisement key={`left-${currentAdIndex}`} ad={advertisements[currentAdIndex]} position="left" />
            <SideAdvertisement
              key={`right-${currentAdIndex}`}
              ad={advertisements[(currentAdIndex + 1) % advertisements.length]}
              position="right"
            />
          </>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{
          backgroundImage: `url(${darkMode ? TurfImageNight : TurfImageDay})`,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative min-h-screen mt-16 w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
      >

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-11/12 sm:w-1/2 p-8 bg-black bg-opacity-80 text-white rounded-lg shadow-lg mr-4 sm:mr-12 backdrop-blur-sm relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center my-4 gap-2 border border-yellow-300 bg-yellow-50 rounded-lg px-3 py-1 w-fit shadow-md hover:shadow-lg hover:-translate-y-1 transition group"
          >
            <p className="font-display font-medium text-red-500 flex items-center group">
              <motion.span
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                className="mr-1"
              >
                ⏰
              </motion.span>
              Hurry Up!
              <span className="text-yellow-800"> Prime Slots Filling Fast!!</span>
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-orbitron text-4xl sm:text-5xl font-semibold leading-snug text-white"
          >
            Find & Book the Best Turfs Near You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-montserrat text-lg mt-4 sm:text-xl sm:mt-6"
          >
            Book, manage, and track turf bookings with ease. Perfect for sports enthusiasts and administrators.
            Available across all platforms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex gap-4 flex-col sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold rounded-lg text-white border border-white bg-green-600 shadow-lg hover:bg-green-700"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 font-semibold rounded-lg bg-white text-black border border-gray-500 hover:border-gray-800"
            >
              Explore Features
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <p className="mb-2 text-sm">Scroll Down</p>
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      <div ref={contentRef}>
        {/* Sports Categories Section */}
        <section
  style={{
    backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
  }}
  className="py-16"
>
  <div className="container mx-auto px-4">
    {/* Heading Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
        EXPLORE BY SPORT
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Find Turfs For Your Favorite Sport
      </h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        Our facilities are designed to accommodate a wide range of sports activities
      </p>
    </motion.div>

    {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ml-72 gap-6">
        {sportsCategories.map((sport, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden text-center group cursor-pointer w-32 h-40 md:w-40 md:h-48"
          >
            <div
              className={`${sport.color} h-28 flex items-center justify-center group-hover:h-32 transition-all duration-300`}
            >
              <FontAwesomeIcon icon={sport.icon} className="text-5xl text-white" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{sport.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
</section>



        {/* Search, Book, Play Timeline */}
        <section
        ref={ref}
        style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
        }}
        className="py-16 flex flex-col items-center relative"
      >
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">How It Works</h2>
        <div className="w-1 mt-10 h-[61rem] absolute left-1/2 transform -translate-x-1/2 bg-gray-300 dark:bg-gray-600"></div>
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: item.position === "left" ? -150 : 150 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 2.5, delay: index * 0.5 }}
            className={`relative flex items-center w-full max-w-6xl my-8 ${
              item.position === "left" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`w-1/2 p-6 ${
                item.position === "left" ? "pr-12" : "pl-12"
              }`}
            >
              <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-600 transition-all duration-300 hover:shadow-xl">
                <FontAwesomeIcon
                  icon={item.icon}
                  size="3x"
                  className="mb-4 text-[#5886a7] dark:text-[#9fbfd8] animate-bounce"
                />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
            <div className="w-14 h-14 bg-[#5886a7] dark:bg-[#9fbfd8] rounded-full absolute left-1/2  text-white text-xl font-bold transform -translate-x-1/2 flex items-center justify-center">{index + 1}</div>
          </motion.div>
        ))}
      </section>

        {/* Benefits Section */}
        <section
          style={{
            backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
          }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
                WHY CHOOSE US
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Benefits of Using TurfBook
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                We make booking sports facilities easier than ever before
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
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
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md relative z-20 overflow-hidden group"
                >
                  <div className={`${benefit.color} h-2 group-hover:h-4 transition-all duration-300`}></div>
                  <div className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                      <FontAwesomeIcon
                        icon={benefit.icon}
                        className={`text-2xl ${benefit.color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{benefit.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Turfs */}
        <section
          style={{
            backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
          }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
                TOP PICKS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Turfs</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Discover our most popular and highly-rated turf facilities
              </p>
            </motion.div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === "all"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory("premium")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === "premium"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                Premium
              </button>
              <button
                onClick={() => setActiveCategory("standard")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === "standard"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setActiveCategory("budget")}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === "budget"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                Budget
              </button>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-3 gap-8 mx-4 md:mx-7">
              <AnimatePresence mode="wait">
                {filteredTurfs.map((turf, index) => (
                  <motion.div
                    key={turf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg relative z-20"
                  >
                    <div className="relative">
                      <img
                        src={turf.image || "/placeholder.svg"}
                        alt={turf.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        ₹{turf.pricePerHour}/hr
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{turf.name}</h2>
                      <div className="flex items-center mb-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
                        <p className="text-gray-600 dark:text-gray-400">{turf.location}</p>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={
                                i < Math.floor(turf.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{turf.rating}</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {turf.sports.map((sport, i) => (
                            <span
                              key={i}
                              className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {turf.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/turf"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-lg"
              >
                View All Turfs
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          style={{
            backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
          }}
          className="py-16 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-green-50 dark:bg-gray-900 opacity-70"></div>

            {/* Quote marks */}
            <div className="absolute top-10 left-10 text-9xl text-green-200 dark:text-green-900 opacity-20">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </div>

            <div className="absolute bottom-10 right-10 text-9xl text-green-200 dark:text-green-900 opacity-20">
              <FontAwesomeIcon icon={faQuoteRight} />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Hear from our satisfied customers about their experiences
              </p>
            </motion.div>

            <div className="relative w-full max-w-5xl mx-auto">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonials}
                className="absolute -left-5 md:-left-10 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiChevronLeft className="text-gray-800 dark:text-white text-xl" />
              </button>

              {/* Testimonials Grid */}
              <div className="overflow-hidden w-full md:w-[80vw] lg:w-[70vw]">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${index * 33.33}%)` }}
                >
                  {testimonials.map((testimonial, i) => (
                    <div
                      key={testimonial._id || i}
                      className="w-full md:w-[33.33%] flex-shrink-0 p-4 transition-all duration-300 pt-20"
                    >
                      <motion.div
                        whileHover={{ y: -10 }}
                        className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center text-center h-full"
                      >
                        <div className="absolute -top-10">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-green-600 rounded-full blur opacity-75"></div>
                            <img
                              src={testimonial?.userId?.image || "/placeholder.svg"}
                              alt={testimonial?.userId?.firstName || "User"}
                              className="relative w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                            />
                          </div>
                        </div>

                        <div className="pt-12">
                          {/* Comment */}
                          <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.commentText}"</p>

                          {/* User Info */}
                          <div>
                            <span className="block font-semibold capitalize text-gray-900 dark:text-white text-lg">
                              {`${testimonial?.userId?.firstName || "User"} ${testimonial?.userId?.lastName || ""}`}
                            </span>
                            <span className="block text-sm text-green-600 dark:text-green-400">
                              {testimonial?.turfId?.turfName || "Turf User"}
                            </span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex justify-center mt-3">
                            {[...Array(5)].map((_, i) => (
                              <HiStar
                                key={i}
                                className={`text-lg ${
                                  i < (testimonial?.rating?.rating || 0)
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextTestimonials}
                className="absolute -right-5 md:-right-10 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiChevronRight className="text-gray-800 dark:text-white text-xl" />
              </button>
            </div>

            {/* Dots (Indicators) */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === index
                      ? "bg-green-600 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section
          style={{
            backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
          }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-medium text-sm mb-4">
                HAVE QUESTIONS?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Find answers to common questions about our services
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white pr-8">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-1 rounded-full ${
                        openIndex === index
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600 dark:text-gray-300 mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center bg-green-50 dark:bg-green-900 px-6 py-3 rounded-full">
                <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 mr-2" />
                <p className="text-green-800 dark:text-green-200">
                  Still have questions?{" "}
                  <Link to="/contact" className="font-bold underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-600 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://source.unsplash.com/1600x900/?football,field')] bg-cover bg-center opacity-20 z-0"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Book Your Perfect Turf?</h2>
              <p className="text-xl mb-8 text-white opacity-90 max-w-3xl mx-auto">
                Join thousands of sports enthusiasts and book your ideal playing field today!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-full shadow-xl hover:bg-green-50 transition duration-300 transform"
              >
                Get Started Now
              </motion.button>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-white">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center text-white">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center text-white">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-[#5886a7] dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stay Updated</h2>
              <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Subscribe to our newsletter for the latest turf news, exclusive offers, and special promotions!
              </p>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300 shadow-lg sm:whitespace-nowrap"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Subscribe
                  </motion.button>
                </div>
              </form>
              <p className="text-blue-200 mt-4 text-sm">We respect your privacy. Unsubscribe at any time.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home

