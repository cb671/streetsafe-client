import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Map, NavigationControl, ScaleControl, useControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getTweenedColorHsl} from "../util/color.js";
import {MapboxOverlay} from '@deck.gl/mapbox';
import '@deck.gl/widgets/stylesheet.css';
import {getMapData} from '../api/api.js';
import {PathLayer, PointCloudLayer} from "@deck.gl/layers";
import {COORDINATE_SYSTEM} from "@deck.gl/core";
import {routeColors} from "../util/const.js";
import {initialPosition} from "../contexts/MapContext.jsx";

export const colorRange = [
  [1, 152, 189, 255],
  [73, 227, 206, 255],
  [216, 254, 181, 255],
  [254, 237, 177, 255],
  [254, 173, 84, 255],
  [209, 55, 78, 255],
];

function DeckGLOverlay(props){
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

export default function MapComponent({onClick, mode, userPosition, position, bounds, routes, resolveMapRef}){
  const [data, setData] = useState([]);
  const [geoPos, setGeoPos] = useState(userPosition);
  const [mapPos, setMapPos] = useState(position);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [lastFlight, setLastFlight] = useState(null);
  const mapRef = useRef();
  const activeIdx = 1;

  const layers = [];

  if(mode === "go"){
    if(data.length === 0 || data[0].crime_factor !== undefined){
      const routesLayer = new PathLayer({
        id: "routes",
        data,
        pickable: true,
        material,
        opacity: 1,
        getWidth: 1,
        widthMinPixels: 3,
        billboard: true,
        capRounded: true,
        jointRounded: true,
        getColor: (d) => {
          if(d.go) return routeColors[-1];
          return routeColors[d.crime_factor].map((v, i) => i === 3 ? d.hidden ? 0 : v : d.active ? v : v / 3);
        },
        getPath: (d) => {
          return d.routes[0].geometry.coordinates.map(c => {
            return [c[0], c[1], d.go ? 0 : d.active ? 1 : 0]
          });
        },
      });

      layers.push(routesLayer);
    }

    if(geoPos){
      const layer = new PointCloudLayer({
        id: 'PointCloudLayer',
        data: [
          {"position": [0, 0, 0], "normal": [1, 1, 1], "color": [96, 165, 250]},
        ],

        getColor: (d) => d.color,
        getNormal: (d) => d.normal,
        getPosition: (d) => d.position,
        pointSize: 6,
        parameters: {
          depthTest: false
        },
        coordinateOrigin: geoPos,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        material,
        layerIndex: 1000
      });

      layers.push(layer);
    }
  }else{
    const layer = new H3HexagonLayer({
      id: "hexagons",
      data,
      pickable: true,
      getHexagon: d => d[0],
      getElevation: d => d[activeIdx],
      getFillColor: d => getTweenedColorHsl(Math.min(1, Math.max(0, d[activeIdx] / 10)), colorRange),
      extruded: true,
      material,

      transitions: {
        elevationScale: 1000
      },
      opacity: 0.4,
      coverage: 0.8,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 100],
      elevationScale: 250,

      onClick: info => {
        if(info.object){
          onClick && onClick(info.object);
        }
      },
    });

    layers.push(layer);
  }

  useEffect(() => {
    setData([]);
    if(mode !== "go"){
      getMapData().then(d => {
        setData(d);
      });
    }

    return () => {
    };
  }, [mode]);

  useEffect(() => {
    setGeoPos(userPosition);
  }, [userPosition]);

  useEffect(() => {
    if(!!bounds) mapRef.current.fitBounds(bounds, {
      padding: {bottom: (window.screen.availHeight / 3) * 2 + 32, top: 32, left: 32, right: 32}
    })
  }, [bounds]);

  useEffect(() => {
    if(!routes) return setData([]);
    setData(routes);
  }, [routes]);

  const updateMapPos = (pos) => {
    const flyTo = {}
    if(pos.longitude !== undefined || pos.latitude !== undefined){
      flyTo.center = {
        lon: pos.longitude,
        lat: pos.latitude
      };
    }
    if(pos.zoom !== undefined) flyTo.zoom = pos.zoom;
    if(pos.pitch !== undefined) flyTo.pitch = pos.pitch;
    if(pos.bearing !== undefined) flyTo.bearing = pos.bearing;
    if(pos.offset) flyTo.offset = pos.offset;

    setLastFlight(pos);

    if(mapRef.current.isMoving() || mapRef.current.isRotating()) return;
    if(pos.direct) mapRef.current.jumpTo(flyTo);
    else mapRef.current.flyTo(flyTo);
    if(pos.callback) pos.callback();
  }

  useEffect(() => {
    if(mapLoaded) updateMapPos(position);
    setMapPos(position);
  }, [position]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
    updateMapPos(mapPos);
  }, [mapPos]);

  useEffect(()=>{
    resolveMapRef && resolveMapRef(mapRef?.current || false);
  },[resolveMapRef]);

  return (
    <Map
      style={{width: '100%', height: '100vh'}}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      initialViewState={{
        longitude: mapPos.longitude,
        latitude: mapPos.latitude,
        zoom: mapPos.zoom,
        bearing: mapPos.bearing,
        pitch: mapPos.pitch,
      }}
      ref={mapRef}
      minZoom={5}
      maxZoom={initialPosition.maxZoom}
      doubleClickZoom={false}
      attributionControl={false}
      onLoad={onMapLoad}
    >
      <DeckGLOverlay
        layers={layers}
        interleaved={false}
      />
      <NavigationControl/>
      <ScaleControl position={"top-left"}/>
    </Map>
  )
}
