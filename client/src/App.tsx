// @ts-nocheck
import 'maplibre-gl/dist/maplibre-gl.css';
import { RMap } from 'maplibre-react-components';
import GeoTiffMap from './GeoTiffMap';

// const mountain: [number, number] = [6.4546, 46.1067];

function App() {
  const geoTiffUrl = 'path/to/your/geotiff/file.tif'; // Replace with your GeoTIFF URL

  return (
    <div>
      <h1>GeoTIFF Viewer</h1>
      <GeoTiffMap geoTiffUrl={geoTiffUrl} />
    </div>
  );
  // return (
  //   <RMap
  //     minZoom={6}
  //     initialCenter={mountain}
  //     initialZoom={8}
  //     mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
  //   />
  // );
}

export default App;
