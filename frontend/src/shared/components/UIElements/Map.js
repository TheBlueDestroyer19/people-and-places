import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";

import './Map.css'

const OLMap = ({ center, zoom }) => {
  const mapRef = useRef();

  useEffect(() => {
  const map = new Map({
    target: mapRef.current,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat(center),
      zoom: zoom
    })
  });

  const marker = new Feature({
    geometry: new Point(fromLonLat(center))
  });

  marker.setStyle(
    new Style({
      image: new Icon({
        src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        scale: 0.05
      })
    })
  );

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [marker]
    })
  });

  map.addLayer(vectorLayer);

  setTimeout(() => {
    map.updateSize();
  }, 200);

  // Cleanup
  return () => map.setTarget(null);
}, [center, zoom]);

    return <div ref={mapRef} className="map" />;

};

export default OLMap;


