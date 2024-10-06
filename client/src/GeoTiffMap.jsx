import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const initialCenter = [42.6526, -73.7562]; // seattle

/**
 * [47.608013, -122.335167]; // seattle
 * California: Sacramento [38.5816, -121.4944]
Texas: Austin [30.2711, -97.7431]
Florida: Tallahassee [29.7604, -95.3698]
New York: Albany [42.6526, -73.7562]
Illinois: Springfield [39.7604, -89.6371]
Pennsylvania: Harrisburg [40.2897, -76.8756]
Ohio: Columbus [39.9612, -83.0007]
Michigan: Lansing [42.7325, -84.4824]
Georgia: Atlanta [33.7490, -84.3879]
North Carolina: Raleigh [35.7775, -78.6380]
 */

const GeoTiffMap = ({locations, clickLocateMe}) => {
  const mapRef = useRef();
  //const [locations, setLocations] = useState([42.6526, -73.7562]);
  useEffect(() => {
    const loadGeoTiff = async () => {
      // Fetch the GeoTIFF file
      const response = await fetch('./01_2021_CO2_Seattle.tif');
      const arrayBuffer = await response.arrayBuffer();

      // Convert it to a GeoRaster
      const geoRaster = await parseGeoraster(arrayBuffer);

      // Create a GeoRasterLayer
      const geoRasterLayer = new GeoRasterLayer({
        georaster: geoRaster,
        opacity: 0.7,
        pixelValuesToColorFn: (values) => {
          // Example: Define how to convert pixel values to colors
          return values[0] === null
            ? 'transparent'
            : `rgba(0, 255, 0, ${values[0] / 255})`;
        },
      });

      // Add the GeoRasterLayer to the map
      geoRasterLayer.addTo(mapRef.current);
    };

    loadGeoTiff();
  }, []);
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(locations, 8); // Adjust zoom level if necessary
    }
  }, [locations]); // Runs when locations state changes

  return (
    <MapContainer
      center={locations}
      zoom={3.5}
      style={{ height: '100vh', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {clickLocateMe && <Marker position={locations}> {/* You can remove icon prop if using default */}
        <Popup>
          A custom popup message can be displayed here.
        </Popup>
      </Marker>}
    </MapContainer>
  );
};

export default GeoTiffMap;
