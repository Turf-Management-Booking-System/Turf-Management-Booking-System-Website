import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import {useNavigate , Link} from 'react-router-dom'


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode,setDarkMode] = useState(false);

const navigate = useNavigate();
const handleLoginClick = () => {
  navigate("/login")
}
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleMenu = () => { 
    setMenuOpen((prevState) => !prevState);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev )
  }


  return (
    <nav className=" p-3 flex bg-[#065F46] text-white justify-between items-center fixed top-0 left-0 right-0 z-20 shadow-md">
      {/* Logo(Desktop) */}
      <Link to="/" className=" flex gap-2 items-center flex-1">
        <span className="text-lg font-orbitron font-bold">KickOnTurf</span>
      </Link>

      {/* Navbar(Desktop) */}
      <div id="nav-menu" className="hidden lg:flex gap-12">
        <Link to="/" className="font-medium font-bebas hover:text-green-800">Home</Link>
        <Link to="/about" className="font-medium font-montserrat hover:text-green-800">About</Link>
        <Link to="/contact" className="font-medium font-orbitron hover:text-green-800">Contact</Link>
      </div>

   
      {/* Login Button (Desktop) and {/*Dark and Light mode */}
      
      {/* <div className="hidden lg:flex flex-1 justify-end"> */}
      <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-lg rounded-full p-2 hover:bg-green-500 dark:hover:bg-gray-700"
        >
          {darkMode ? <i className='bx bxs-moon'></i> : <i class='bx bxs-sun'></i>}
        </button>

        <button onClick={handleLoginClick} className="flex gap-2 items-center border border-green-600 px-6 py-2 rounded-lg hover:border-green-800">
          <span className="font-display font-medium">Login</span>
        </button>
      </div>

      {/* toggle button*/}
      <button className="p-2 lg:hidden" onClick={handleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
      </button>

      {/* Mobile Navigation */}
      <div
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } fixed z-10  bg-white inset-0 p-3 flex-col`}
      >
        {/* Mobile Logo*/}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium font-display">KickOnTurf</span>
          <button className="p-2" onClick={handleMenu}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Mobile Navbar */}
        <div className="space-y-4">
          <a href="#" className="font-medium hover:text-green-800 block">Home</a>
          <a href="#" className="font-medium hover:text-green-800 block">About</a>
          <a href="#" className="font-medium hover:text-green-800 block">Contact</a>
          <a href="#" className="font-medium hover:text-green-800 block">Login</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
