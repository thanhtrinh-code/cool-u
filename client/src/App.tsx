// @ts-nocheck
import 'maplibre-gl/dist/maplibre-gl.css';
import GeoTiffMap from './GeoTiffMap';
import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

const countries = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

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
    <div className="bg-white p-5 rounded-lg shadow-lg">
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

      <div className="flex justify-center">
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

const generateTiffUrl = (monthIndex) => {
  const year = 2021;
  const month = String(monthIndex + 1).padStart(2, '0');
  return `./${year}${month}.tif`;
};

function App() {
  const [selectedTiffUrl, setSelectedTiffUrl] = useState(generateTiffUrl(0));
  const [openChat, setOpenChat] = useState(false);
  const [locations, setLocations] = useState([42.6526, -73.7562]);
  const [loading, setLoading] = useState(false);
  const [clickLocateMe, setClickLocateMe] = useState(false);
  const [country, setCountry] = useState('');

  const handleMonthChange = (index) => {
    setSelectedTiffUrl(generateTiffUrl(index));
  };

  function toggleMenu() {
    const menu = document.querySelector('#mobile-menu');
    menu.classList.toggle('hidden');
  }

  function handleLocateUser(e) {
    e.preventDefault();
    if ('geolocation' in navigator) {
      setLoading(true);
      setClickLocateMe(false);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocations([latitude, longitude]);
          setClickLocateMe(true);
          setLoading(false);
        },
        (err) => {
          console.error(err.message);
          setLoading(false);
        }
      );
    } else {
      console.log('Geolocation is not supported by your browser');
    }
  }
  async function handleData () {
    const response = await fetch('http://localhost:3000/getCountryEmissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: "South Carolina",
         }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
  }
  useEffect(() => {
    handleData();
  },[])
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
            <div className="md:flex items-center gap-2">
              <button
                onClick={handleLocateUser}
                className="outline-none font-medium px-2 py-2 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
              >
                {loading ? 'Loading...' : 'Locate Me'}
              </button>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="py-2 px-4 m-2 text-black bg-gray-200 rounded focus:outline-none focus:border-green-500 transition duration-300"
              >
                <option value="" disabled>
                  Select a state
                </option>
                {countries.map((countryName, index) => (
                  <option key={index} value={countryName}>
                    {countryName}
                  </option>
                ))}
              </select>
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          Get to know the CO2 emissions in your neighborhood!
        </h1>
        <MapWithMonthSlider onMonthChange={handleMonthChange} />
        <GeoTiffMap
          locations={locations}
          clickLocateMe={clickLocateMe}
          geoTiffUrl={selectedTiffUrl}
        />
      </div>
      {openChat && <ChatBot />}
      <div
        className="z-[1000] fixed bottom-5 right-5"
        onClick={() => setOpenChat((open) => !open)}
      >
        <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-700 transition duration-300 ease-in-out">
          {!openChat ? 'EcoScope Bot' : 'Close'}
        </button>
      </div>
    </>
  );
}

export default App;
