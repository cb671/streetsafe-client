import React from 'react';
import {DeckGL} from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {ZoomWidget} from '@deck.gl/react';
import {Map} from 'react-map-gl/maplibre';
import {MapView, FirstPersonView} from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';
import data from './new.json';
import {H3HexagonLayer} from '@deck.gl/geo-layers';

const INITIAL_VIEW_STATE= {
  longitude: -3.24718538,
  latitude: 53.15126933,
  zoom: 5.93,
  bearing: -27,
  pitch: 40.5,
};


  export default function MapComponent() {
    return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller
    >


    <H3HexagonLayer
        id = 'hexagon'
        data = {data}
        getHexagon = {d => d[0]}
        elevationScale = {2000}
        getElevation = {d => 100}
        getFillColor = {d => {
            console.log(d);
            return [255, 255, 255, 255]
            if (d[1] == 0) {
                return [0,0,0,0]
            } else {
                const t = d[1] / 50
                return [255, 255, 255, 255].map(i => i * t)
            } 
        }}
        extruded = {true}  
    />


      <MapView id="map" width="50%" controller >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
      </MapView>

      <FirstPersonView width="50%" x="50%" fovy={50} />

      <ZoomWidget/>
    </DeckGL>
    )
  }