// @ts-nocheck
import 'maplibre-gl/dist/maplibre-gl.css';
import GeoTiffMap from './GeoTiffMap';
import { useState } from 'react';
import ChatBot from './ChatBot';
function App() {
  const [openChat, setOpenChat] = useState(false);
  function toggleMenu() {
    const menu = document.querySelector('#mobile-menu');
    menu.classList.toggle('hidden');
  }

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="hidden md:flex items-center space-x-1">
                <a
                  href="#"
                  className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold"
                >
                  Map
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="#about-us"
                className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
              >
                About Us
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button
                className="outline-none mobile-menu-button"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6 text-gray-500 hover:text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden mobile-menu" id="mobile-menu">
          <ul className="">
            <li className="active">
              <a
                href="#"
                className="block text-sm px-2 py-4 text-white bg-green-500 font-semibold"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto mt-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Get to know your neighborhood!
        </h1>
        
        <GeoTiffMap />

      </div>
      {openChat && <ChatBot/>

      }
      <div className="z-[1000] fixed bottom-5 right-5" onClick={() => setOpenChat(open => !open)}>
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-300 ease-in-out">
                {!openChat ? "ChatBot" : "Close"}
            </button>
      </div>
      
    </>
  );
}

export default App;
