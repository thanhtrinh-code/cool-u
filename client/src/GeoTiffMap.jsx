import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const getColorFromValue = (value) => {
  if (value >= 0 && value <= 24) {
    return '#2b83ba';
  } else if (value >= 25 && value <= 49) {
    return '#abdda4';
  } else if (value >= 50 && value <= 74) {
    return '#ffffbf';
  } else if (value >= 75 && value <= 99) {
    return '#fdae61';
  } else if (value >= 100) {
    return '#d7191c';
  }
};

const GeoTiffMap = ({ geoTiffUrl, locations, clickLocateMe }) => {
  const mapRef = useRef();
  const geoRasterLayerRef = useRef(null);
  const initialCenter = [47.608013, -122.335167];

  useEffect(() => {
    const loadGeoTiff = async () => {
      const response = await fetch(geoTiffUrl);
      const arrayBuffer = await response.arrayBuffer();
      const geoRaster = await parseGeoraster(arrayBuffer);

      if (geoRasterLayerRef.current) {
        mapRef.current.removeLayer(geoRasterLayerRef.current);
      }

      const geoRasterLayer = new GeoRasterLayer({
        georaster: geoRaster,
        opacity: 0.3,
        pixelValuesToColorFn: (values) => {
          const pixelValue = values[0];
          return getColorFromValue(pixelValue);
        },
      });

      geoRasterLayer.addTo(mapRef.current);
      geoRasterLayerRef.current = geoRasterLayer;
    };

    loadGeoTiff();

    return () => {
      if (geoRasterLayerRef.current) {
        mapRef.current.removeLayer(geoRasterLayerRef.current);
      }
    };
  }, [geoTiffUrl]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(locations, 8); // Adjust zoom level if necessary
    }
  }, [locations]); // Runs when locations state changes

  return (
    <>
      <style>
        {`
      .leaflet-popup-content {
        width: 150px; /* Set your desired width */
        max-width: 100%; /* Ensure it doesn't exceed the container */
      }
    `}
      </style>
      <MapContainer
        center={locations}
        zoom={3.5}
        style={{ height: '68vh', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {clickLocateMe && (
          <Marker position={locations}>
            <Popup>
              <div className="popup-content bg-white shadow-lg rounded-md max-w-xs">
                <h4 className="text-md font-semibold text-green-800 text-center">
                  CO2 Emission
                </h4>
                <h3 className="text-lg font-semibold text-green-600 text-center p-4">
                  40
                </h3>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default GeoTiffMap;
