import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

const initialCenter = [47.608013, -122.335167];

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

const GeoTiffMap = ({ geoTiffUrl }) => {
  const mapRef = useRef();
  const geoRasterLayerRef = useRef(null);

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
