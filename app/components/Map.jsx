import React from 'react';
import {LineLayer} from '@deck.gl/layers';
import {useWidget, ZoomWidget} from '@deck.gl/react';
import {Map, useControl} from 'react-map-gl/maplibre';
import {MapView, FirstPersonView} from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import data from './new.json';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getTweenedColorHsl} from "../util/color.js";
import {MapboxOverlay} from '@deck.gl/mapbox';
// import {ZoomWidget} from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';


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

function DeckGLOverlay(props) {
    const overlay = useControl(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

function ZoomWidgetComponent(props) {
    const overlay = useWidget(ZoomWidget, props);
    return null;
}

export default function MapComponent(){
  const activeIdx = 1;
  const layer = new H3HexagonLayer({
    id: "hexagons",
    data,
    pickable: true,
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
    elevationScale: 2000,

    onClick: info => {
      if (info.object) {
        console.log('Clicked hexagon:', info.object);
      }
    }
  })
  

    return (
        <Map 
          style={{ width: '100%', height: '100vh' }}
  
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        initialViewState={{
            longitude: -3.24718538, 
            latitude: 53.15126933, 
            zoom: 5.93, 
            bearing: -27, 
            pitch: 40.5,
        }}
        >
            <DeckGLOverlay 
              layers={[layer]} 
              interleaved 
            >
              <ZoomWidgetComponent></ZoomWidgetComponent>

              </DeckGLOverlay>

        </Map>
    )
}
