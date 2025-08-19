import React from 'react';
import {DeckGL} from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {ZoomWidget} from '@deck.gl/react';
import {Map} from 'react-map-gl/maplibre';
import {MapView, FirstPersonView} from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import data from './new.json';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getTweenedColorHsl} from "../util/color.js";

const INITIAL_VIEW_STATE = {
  longitude: -3.24718538, latitude: 53.15126933, zoom: 5.93, bearing: -27, pitch: 40.5,
};

export const colorRange = [
  [1, 152, 189, 255],
  [73, 227, 206, 255],
  [216, 254, 181, 255],
  [254, 237, 177, 255],
  [254, 173, 84, 255],
  [209, 55, 78, 255],
];

export default function MapComponent(){
  const activeIdx = 1;
  const layer = new H3HexagonLayer({
    id: "hexagons",
    data,
    getHexagon: d => d[0],
    getElevation: d => d[activeIdx],
    getFillColor: d => getTweenedColorHsl(Math.min(1, Math.max(0, d[activeIdx] / 50)), colorRange),
    extruded: true,
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51]
    },

    transitions: {
      elevationScale: 1000
    },
    opacity: 0.4,
    coverage: 0.8,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 100],
    elevationScale: 2000
  })
  return (<DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={[layer]}
    >


      <MapView id="map" width="50%" controller>
        <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"/>
      </MapView>

      <FirstPersonView width="50%" x="50%" fovy={50}/>

      <ZoomWidget/>
    </DeckGL>)
}
