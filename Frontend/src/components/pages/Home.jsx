import React, { useContext, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiStar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import blackBg from "../../assets/Images/blackBg.png";
import greenBg from "../../assets/Images/greenBg.png";
import {
  faFutbol,
  faSearch,
  faCalendarCheck,
  faArrowRight,
  faChevronDown,
  faStar,
  faEnvelope,
  faUsers,
  faCheckCircle,
  faLightbulb,
  faShieldAlt,
  faBasketballBall,
  faTableTennis,
  faVolleyballBall,
  faHockeyPuck,
} from "@fortawesome/free-solid-svg-icons";
import TurfImageDay from "../../assets/images/TurfImageDay.jpg";
import TurfImageNight from "../../assets/images/TurfImageNight.jpg";
import { DarkModeContext } from "../../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";
import whiteBg from "../../assets/Images/whiteBg.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLoader } from "../../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import {
  loadNotification,
  setNotification,
} from "../../slices/notificationSlice";
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [featuredTurfs,setFeaturedTurfs] = useState([]);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const user = useSelector((state) => state.auth.user);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const timelineItems = [
    {
      icon: faSearch,
      title: "Search",
      desc: "Explore the largest network of sports facilities all over India.",
      position: "left",
    },
    {
      icon: faCalendarCheck,
      title: "Book",
      desc: "Connect with the venue through the Book Now button to make online booking easy and secure.",
      position: "right",
    },
    {
      icon: faFutbol,
      title: "Play",
      desc: "The scene is set for your epic match!",
      position: "left",
    },
  ];

  const faqs = [
    {
      question: "How do I book a turf?",
      answer:
        "You can easily book a turf by searching for available slots, selecting your preferred time, and completing the booking process online.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 24 hours before the scheduled time for a full refund.",
    },
    {
      question: "What types of sports can I play?",
      answer:
        "Our turfs are suitable for various sports including football, cricket, tennis, and more. Check individual turf details for specific sport options.",
    },
    {
      question: "Do I need to create an account to book a turf?",
      answer:
        "Yes, creating an account helps you manage your bookings, check availability, and receive updates.",
    },
    {
      question: "How do I check my booking details?",
      answer:
        "You can check your booking details in the 'My Bookings' section of your account",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept UPI, credit/debit cards, net banking, and cash payments at selected locations.",
    },
    {
      question: "What are the rules for using the turf?",
      answer:
        "Users must wear proper sports footwear, avoid littering, and respect the time slot allotted to them. We have provided rules on each specific turf thats need to be follow",
    },

    {
      question: "How do I contact customer support?",
      answer:
        "To reach us go through contact page ,you can send mail,you can call on given number",
    },
  ];

 
  const sportsCategories = [
    { name: "Football", icon: faFutbol, color: "bg-green-500" },
    { name: "Cricket", icon: faFutbol, color: "bg-blue-500" },
    { name: "Basketball", icon: faBasketballBall, color: "bg-orange-500" },
    { name: "Tennis", icon: faTableTennis, color: "bg-yellow-500" },
    { name: "Volleyball", icon: faVolleyballBall, color: "bg-purple-500" },
    { name: "Hockey", icon: faHockeyPuck, color: "bg-red-500" },
  ];
  const benefits = [
    {
      icon: faCheckCircle,
      title: "Easy Booking",
      description: "Book your preferred turf in just a few clicks",
      color: "bg-blue-500",
    },
    {
      icon: faShieldAlt,
      title: "Secure Payments",
      description: "Multiple secure payment options available",
      color: "bg-green-500",
    },
    {
      icon: faLightbulb,
      title: "Smart Recommendations",
      description:
        "Get personalized turf suggestions based on your preferences",
      color: "bg-yellow-500",
    },
    {
      icon: faUsers,
      title: "Team Management",
      description: "Organize your team and invite players easily",
      color: "bg-purple-500",
    },
  ];
  const fetchAllTestimonals = async () => {
    try {
      dispatch(setLoader(true));
      const url =
        "http://localhost:4000/api/v1/comment/getCommentWithTestimonals";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("fetch the testimonals", response.data.testimonals);
      if (response.data.success) {
        setTestimonials(response.data.testimonals);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while deleting turf data!"
      );
      console.log(error.response?.data?.message);
    } finally {
      dispatch(setLoader(false));
    }
  };
  useEffect(() => {
    fetchAllTestimonals();
  }, []);

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const prevTestimonials = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextTestimonials = () => {
    setIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));
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
        }
      );
      console.log("response", response.data.success);

      if (response.data.success) {
        toast.success("Thanks For Subscribing!");
        if (user?._id) {
          dispatch(loadNotification());
          try {
            const notificationResponse = await axios.get(
              `http://localhost:4000/api/v1/notify/getNotifications/${user._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  withCredentials: true,
                },
              }
            );
            if (notificationResponse.data.success) {
              console.log(
                "fetch notification",
                notificationResponse.data.currentMessage
              );
              dispatch(
                setNotification(notificationResponse.data.currentMessage || [])
              );
              localStorage.setItem(
                "userNotification",
                JSON.stringify(notificationResponse.data.currentMessage || [])
              );
              console.log("notifications state", notifications);
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Something Went Wrong in fetching notifications!"
            );
            console.log(error.response?.data?.message);
          }
        }

        setEmail("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error While Subscribing!");
      console.error("Error:", error.response?.data?.message);
    } finally {
      dispatch(setLoader(false));
    }
    setEmail("");
  };
   const fetchFetauredTurfs = async ()=>{
    try{
        dispatch(setLoader(true))
        const response =await  axios.get(`http://localhost:4000/api/v1/turf/getTopBookedTurfs`)
        if(response.data.success && response.data.data){
          dispatch(setLoader(false))
          setFeaturedTurfs((response.data.data))
          console.log(featuredTurfs)
        }
    }catch(error){
      console.log("error",error)
    }finally{
       dispatch(setLoader(false))
    }
   }
   useEffect(()=>{
          fetchFetauredTurfs()
   },[])
   const [slidesToShow, setSlidesToShow] = useState(1);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setSlidesToShow(3);
    } else if (window.innerWidth >= 768) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(1);
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
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
        className="relative min-h-screen mt-12 w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
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
              <span className="text-yellow-800">
                {" "}
                Prime Slots Filling Fast!!
              </span>
            </p>
          </motion.div>
          <h1 className="font-orbitron text-3xl sm:text-4xl font-semibold leading-snug">
            Find & Book the Best Turfs Near You!
          </h1>
          <p className="font-montserrat text-lg mt-4 sm:text-xl sm:mt-6">
            Book, manage, and track turf bookings with ease. Perfect for sports
            enthusiasts and administrators. Available across all platforms.
          </p>
          <div className="mt-8 flex gap-4 flex-col sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/turf")}
              className="px-6 py-3 font-semibold rounded-lg text-white border border-white bg-green-600 shadow-sm hover:bg-opacity-90"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="px-6 py-3 font-semibold rounded-lg bg-white text-black border border-gray-500 hover:border-gray-800"
            >
              Explore Features
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Search, Book, Play Timeline */}
      <section
        ref={ref}
        style={{
          backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
        }}
        className="py-16 flex flex-col items-center relative"
      >
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-green-600">
          How It Works
        </h2>
        <div className="w-1 mt-10 h-[88rem] md:h-[61rem] absolute left-1/2 transform -translate-x-1/2 bg-gray-300 dark:bg-gray-600"></div>
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0}}
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
            <div className="w-14 h-14 bg-[#5886a7] dark:bg-[#9fbfd8] rounded-full absolute left-1/2  text-white text-xl font-bold transform -translate-x-1/2 flex items-center justify-center">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </section>
      {/* Sports*/}
      <section
        style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
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
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium text-sm mb-4">
              EXPLORE BY SPORT
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Find Turfs For Your Favorite Sport
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our facilities are designed to accommodate a wide range of sports
              activities
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden text-center group cursor-pointer"
              >
                <div
                  className={`${sport.color} h-24 flex items-center justify-center group-hover:h-28 transition-all duration-300`}
                >
                  <FontAwesomeIcon
                    icon={sport.icon}
                    className="text-4xl text-white"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {sport.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
            <span className="inline-block px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-medium text-sm mb-4">
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
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group"
              >
                <div
                  className={`${benefit.color} h-2 group-hover:h-4 transition-all duration-300`}
                ></div>
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                    <FontAwesomeIcon
                      icon={benefit.icon}
                      className={`text-2xl ${benefit.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section
        style={{
          backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
        }}
        className="py-16 "
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-green-600">
            Featured Turfs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ml-7 mr-7">
            {featuredTurfs.map((turf, index) => (
              <motion.div
                key={turf.id}
                initial={{ x: -200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: false, amount: 0.2 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={turf.image[0] || ""}
                  alt={""}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {turf.turfName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <i className="bx bx-map text-red-500"></i> {turf.location}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-green-600 dark:text-green-400 font-bold mt-2">
                      ₹{turf.pricePerHour}/hr
                    </p>
                    <div className="flex items-center mt-4 group relative">
  <span className="text-purple-500 mr-2">
    <FontAwesomeIcon icon={faUsers} /> {/* People icon for bookings */}
  </span>
  <span className="font-bold dark:text-white">
    {turf.bookingsCount}
  </span>
  <span className="absolute -bottom-6 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
    Total bookings
  </span>
</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/turf"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View More Turfs
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
  className="py-8 md:py-16" // Responsive padding
>
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center dark:text-green-600">
      What Our Users Say
    </h2>
    
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Left Arrow - hidden on mobile */}
      <button
        onClick={prevTestimonials}
        className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-black dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hover:bg-gray-800 transition-colors"
        aria-label="Previous testimonial"
      >
        <HiChevronLeft className="text-white text-xl" />
      </button>

      {/* Testimonials Container */}
      <div className="overflow-hidden w-full px-2 sm:px-12"> {/* Adjusted padding */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / slidesToShow)}%)`, // Percentage based
          }}
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial._id}
              className="flex-shrink-0 p-2"
              style={{ 
                width: `${100 / slidesToShow}%`, // Dynamic width based on slides to show
                minWidth: '280px' // Minimum width for mobile
              }}
            >
              <div className="relative bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-full">
                <div className="absolute -top-4">
                  <img
                    src={testimonial?.userId?.image || "/placeholder.svg?height=64&width=64"}
                    alt={`${testimonial?.userId?.firstName || "User"}'s profile`}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-gray-300 dark:border-gray-500 object-cover"
                  />
                </div>

                <div className="pt-10 md:pt-12">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs md:text-base line-clamp-3 md:line-clamp-none">
                    {testimonial.commentText}
                  </p>

                  <div>
                    <span className="block font-semibold capitalize dark:text-white text-sm md:text-base">
                      {`${testimonial?.userId?.firstName || "User"} ${testimonial?.userId?.lastName || ""}`}
                    </span>
                    <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {testimonial?.turfId?.turfName || "Turf User"}
                    </span>
                  </div>

                  <div className="flex justify-center mt-2">
                    {[...Array(testimonial?.rating?.rating || 5)].map((_, i) => (
                      <HiStar key={i} className="text-yellow-500 text-sm md:text-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow - hidden on mobile */}
      <button
        onClick={nextTestimonials}
        className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-black dark:bg-gray-700 p-2 rounded-full shadow-md z-10 hover:bg-gray-800 transition-colors"
        aria-label="Next testimonial"
      >
        <HiChevronRight className="text-white text-xl" />
      </button>

      {/* Mobile Indicators */}
      <div className="sm:hidden flex justify-center mt-4 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${index === i ? 'bg-green-600' : 'bg-gray-300'}`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>
      {/*Faqs*/}
      <section
        style={{
          backgroundImage: `url(${darkMode ? blackBg : whiteBg})`,
        }}
        className="py-16 bg-gray-100 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-green-600">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold dark:text-white">{faq.question}</h3>
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <FontAwesomeIcon icon={faChevronDown} className="text-blue-500" />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-600 dark:text-gray-300 overflow-hidden mt-2"
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAT */}
      <section
      style={{
        backgroundImage: `url(${darkMode ? blackBg : greenBg})`,
      }}
      className="py-16 bg-green-600 dark:bg-green-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-green-600 text-black">
            Ready to Book Your Perfect Turf?
          </h2>
          <p className="text-xl mb-8 dark:text-white text-black">
            Join thousands of sports enthusiasts and book your ideal playing
            field today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/turf")}
            className="px-8 py-4 bg-white text-black border border-black dark:border-green-500 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

      {/* Newsletter */}
      <section  className="py-16 bg-[#5886a7] dark:bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-green-600">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for the latest turf news and exclusive offers!
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex border border-green-500 rounded-lg flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 rounded-l-lg sm:rounded-r-none rounded-r-lg mb-2 sm:mb-0 focus:outline-none"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-r-lg sm:rounded-l-none rounded-l-lg hover:bg-green-600 transition duration-300"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Subscribe
              </motion.button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
export default Home;
