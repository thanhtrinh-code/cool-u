import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const initialCenter = [47.608013, -122.335167]; // seattle

const GeoTiffMap = () => {
  const mapRef = useRef();

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

  return (
    <MapContainer
      center={initialCenter}
      zoom={8}
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
