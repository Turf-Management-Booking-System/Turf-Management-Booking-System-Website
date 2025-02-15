import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import "boxicons/css/boxicons.min.css";



const FloatingButton = () => {
  const {darkMode,setDarkMode} = useContext(DarkModeContext);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="fixed bottom-10 right-14 bg-green-800 dark:bg-gray-200 text-white dark:text-black 
                 py-3 px-4 text-center rounded-full shadow-lg transition duration-300 hover:scale-110"
    >
      {darkMode ?  <i className="bx bx-moon text-2xl"></i> :  <i className="bx bx-sun text-2xl"></i>}
    </button>
  );
};

export default FloatingButton;
