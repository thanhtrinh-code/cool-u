import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import GeoRaster from 'georaster';
import parseGeoraster from 'georaster'; 
import GeoRaster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const GeoTiffMap = ({ geoTiffUrl }) => {
  const mapRef = useRef();

  useEffect(() => {
    const loadGeoTiff = async () => {
      // Fetch the GeoTIFF file
      const response = await fetch('./01_2021_CO2_Seattle.tif');
      const arrayBuffer = await response.arrayBuffer();

      // Convert it to a GeoRaster
      const geoRaster = await parseGeoraster(arrayBuffer);
      const geo = await GeoRaster.l

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
  }, [geoTiffUrl]);

  return (
    <MapContainer
      center={[0, 0]} // Set your initial center
      zoom={2} // Set your initial zoom level
      style={{ height: '100vh', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
    </MapContainer>
  );
};

export default GeoTiffMap;
