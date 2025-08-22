import React, {useState} from 'react';
import {Map, useControl, NavigationControl, ScaleControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {useEffect} from 'react';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getTweenedColorHsl} from "../util/color.js";
import {MapboxOverlay} from '@deck.gl/mapbox';
import '@deck.gl/widgets/stylesheet.css';
import { getMapData } from '../api/api.js';
import {ColumnLayer, PointCloudLayer} from "@deck.gl/layers";
import {COORDINATE_SYSTEM} from "@deck.gl/core";


const INITIAL_VIEW_STATE = {
  longitude: -3.24718538,
  latitude: 53.15126933,
  zoom: 5.93,
  bearing: -27,
  pitch: 40.5,
};

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

export default function MapComponent({onClick, mode, userPosition}){
  const [data, setData] = useState(null);
  const [geoPos, setGeoPos] = useState(userPosition);
  const activeIdx = 1;

  const layers = [];

  if(mode === "go"){
    if(geoPos){
      const layer = new PointCloudLayer({
        id: 'PointCloudLayer',
        data: [
          {"position":[0,0,0],"normal":[1,1,1],"color":[96,165,250]},
        ],

        getColor: (d) => d.color,
        getNormal: (d) => d.normal,
        getPosition: (d) => d.position,
        pointSize: 6,
        coordinateOrigin: geoPos,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        material
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

    })

    layers.push(layer);
  }

  useEffect(()=>{
    if(mode !== "go"){
      getMapData().then(d => {
        setData(d);
      });
    }
  }, [mode]);

  useEffect(()=>{
    setGeoPos(userPosition);
  }, [userPosition]);

  return (
    <Map
      style={{width: '100%', height: '100vh'}}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      initialViewState={{
        longitude: -3.24718538,
        latitude: 53.15126933,
        zoom: 5.93,
        bearing: -27,
        pitch: 40.5,
      }}
      minZoom={5}
      maxZoom={15}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <DeckGLOverlay
        layers={layers}
        interleaved
      />
      <NavigationControl/>
      <ScaleControl position={"top-left"}/>
    </Map>
  )
}
