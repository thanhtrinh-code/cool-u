// @ts-nocheck
import 'maplibre-gl/dist/maplibre-gl.css';
import GeoTiffMap from './GeoTiffMap';
import { useState, useEffect } from 'react';

const generateTiffUrl = (monthIndex) => {
  const year = 2021;
  const month = String(monthIndex + 1).padStart(2, '0');
  return `./${year}${month}.tif`;
};

const MapWithMonthSlider = ({ onMonthChange }) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleSliderChange = (event) => {
    const index = Number(event.target.value);
    setSelectedMonthIndex(index);
    onMonthChange(index);
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const id = setInterval(() => {
        setSelectedMonthIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % 12;
          onMonthChange(nextIndex);
          return nextIndex;
        });
      }, 2000);
      setIntervalId(id);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    clearInterval(intervalId);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="11"
          value={selectedMonthIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>January</span>
        <span>December</span>
      </div>

      <div className="flex justify-center mt-4">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  const [selectedTiffUrl, setSelectedTiffUrl] = useState(generateTiffUrl(0));

  const handleMonthChange = (index) => {
    setSelectedTiffUrl(generateTiffUrl(index));
  };

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
          Get to know the CO2 emissions in your neighborhood!
        </h1>
        <MapWithMonthSlider onMonthChange={handleMonthChange} />
        <GeoTiffMap geoTiffUrl={selectedTiffUrl} />
      </div>
    </>
  );
}

export default App;
