import React, { useContext, useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiStar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  faFutbol,
  faSearch,
  faCalendarCheck,
  faArrowRight,
  faChevronDown,
  faStar,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import TurfImageDay from "../../assets/images/TurfImageDay.jpg";
import TurfImageNight from "../../assets/images/TurfImageNight.jpg";
import { DarkModeContext } from "../../context/DarkModeContext";
import { motion ,AnimatePresence} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import whiteBg from "../../assets/Images/whiteBg.png"

function Home() {
  const { darkMode } = useContext(DarkModeContext);
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState(null);
  const [email,setEmail] = useState("");

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

  const featuredTurfs = [
    {
      id: 1,
      name: "Green Valley Turf",
      location: "Mumbai",
      pricePerHour: "1500",
      rating: 4.8,
      image: "",
    },
    {
      id: 2,
      name: "City Central Arena",
      location: "Delhi",
      pricePerHour: "1400",
      rating: 4.2,
      image: "",
    },
    {
      id: 3,
      name: "Sunset Sports Complex",
      location: "Bangalore",
      rating: 4.5,
      pricePerHour: "1100",
      image: "",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Great experience booking through this platform. The turf was in excellent condition!",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Easy to use and a wide variety of turfs to choose from. Highly recommended!",
      rating: 4,
    },
    {
      id: 3,
      name: "Mike Johnson",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Smooth booking process and excellent customer support. Will definitely use again!",
      rating: 5,
    },
    {
      id: 4,
      name: "Mike Johnson",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Smooth booking process and excellent customer support. Will definitely use again!",
      rating: 5,
    },
    {
      id: 5,
      name: "Mike Johnson",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Smooth booking process and excellent customer support. Will definitely use again!",
      rating: 5,
    },
    {
      id: 6,
      name: "Mike Johnson",
      image:"https://up.yimg.com/ib/th?id=OIP.n5CeR93916slWXGyV13PuAHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      turf:"Andred fields turf",
      comment: "Smooth booking process and excellent customer support. Will definitely use again!",
      rating: 5,
    },
  ]
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    }, 5000); 

    return () => clearInterval(interval); 
  }, [testimonials.length]);

  const prevTestimonials = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const nextTestimonials = () => {
    setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribed with email:", email)
    setEmail("")
  }

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
        className="relative min-h-screen mt-16 w-full bg-cover bg-center flex items-center justify-end overflow-hidden"
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
              className="px-6 py-3 font-semibold rounded-lg text-white border border-white bg-green-600 shadow-sm hover:bg-opacity-90"
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
          </div>
        </motion.div>
      </motion.div>

      {/* Search, Book, Play Timeline */}
      <section
        ref={ref}
        style={{
                backgroundImage: `url(${whiteBg}`,
              }}
        className="py-16 flex flex-col items-center relative bg-gray-100 dark:bg-gray-800"
      >
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">How It Works</h2>
        <div className="w-1 mt-10 h-[61rem] absolute left-1/2 transform -translate-x-1/2 bg-gray-300 dark:bg-gray-600"></div>
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: item.position === "left" ? -300 : 300 }}
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
      {/* Featured Turfs */}
      <section 
      style={{
              backgroundImage: `url(${whiteBg}`,
            }}
      className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
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
                  src={turf.image || ""}
                  alt={""}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{turf.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <i className="bx bx-map text-red-500"></i> {turf.location}
                </p>
                <div className="flex justify-between">
                <p className="text-green-600 dark:text-green-400 font-bold mt-2">₹{turf.pricePerHour}/hr</p>
                <div className="flex items-center mt-4">
                <span className="text-yellow-400 mr-1">
                      <FontAwesomeIcon icon={faStar} />
                    </span>
                    <span className="font-bold dark:text-white">{turf.rating}</span>
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
      {/* Testimonials */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">What Our Users Say</h2>
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={prevTestimonials}
            className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10"
          >
            <HiChevronLeft className="text-gray-600 dark:text-white text-2xl" />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden  w-[70vw]">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${index * 33.33}%)` }}>
              {testimonials.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className={`w-[30vw] flex-shrink-0 p-4 transition-all duration-300 pt-20  // Middle testimonial is larger
                  }`}
                >
                  <div className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      
                    <div className="absolute -top-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-25 h-25 rounded-full border-4 border-gray-300 dark:border-gray-500 "
                        style={{ zIndex: 1 }}>
                      </img>
                    </div>

                    <div className="pt-12">
                      {/* Comment */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.comment}</p>

                      {/* User Info */}
                      <div>
                        <span className="block font-semibold dark:text-white">{testimonial.name}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{testimonial.turf}</span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex justify-center mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <HiStar key={i} className="text-yellow-500 text-lg" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextTestimonials}
            className="absolute -right-24 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-10"
          >
            <HiChevronRight className="text-gray-600 dark:text-white text-2xl" />
          </button>
        </div>

        {/* Dots (Indicators) */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index + 1 ? "bg-blue-600 scale-125" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
      {/* Testimonials */}


    

      {/*Faqs*/}
      <section style={{
              backgroundImage: `url(${whiteBg}`,
            }} className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h3 className="text-lg font-semibold dark:text-white">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-blue-500"
                    />
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
      <section className="py-16 bg-green-600 dark:bg-green-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Book Your Perfect Turf?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of sports enthusiasts and book your ideal playing
            field today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#5886a7] dark:bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for the latest turf news and exclusive offers!
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-r-lg hover:bg-green-600 transition duration-300"
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