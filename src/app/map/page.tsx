import MapComponent from "../_components/maps_components/MapComponent";
import { MapProvider } from "../_components/maps_components/MapProvider";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <MapProvider>
        <MapComponent />
      </MapProvider>
    </div>
  );
}
