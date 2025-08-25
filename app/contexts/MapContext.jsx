import {createContext, useContext, useEffect, useMemo, useState} from "react";

const MapInteractionContext = createContext(undefined);

export function useMap() {
  const context = useContext(MapInteractionContext);
  if (!context) {
    throw new Error('useMapClick must be used within MapProvider');
  }
  return context;
}

export const initialPosition = {
  longitude: -2.1460945,
  latitude: 53.1617999,
  zoom: 5.93,
  pitch: 40.5,
  bearing: -27,
  maxZoom: 18,
  offset: undefined
}

export function MapProvider({ children }) {
  const [mapProps, setMapProps] = useState({
    onClick: null,
    position: initialPosition,
    bounds: null,
    routes: null
  });

  const contextValue = useMemo(() => ({
    mapProps,

    setClickHandler: (handler) => {
      setMapProps(prev => ({
        ...prev,
        onClick: handler
      }));
    },

    clearClickHandler: () => {
      setMapProps(prev => ({
        ...prev,
        onClick: null
      }));
    },

    updateMapProps: (props) => {
      setMapProps(prev => ({
        ...prev,
        ...props,
        onClick: prev.onClick
      }))
    },

    setLocation: (pos) => {
      setMapProps(prev => ({
        ...prev,
        position: pos
      }))
    },

    fitBounds: (bounds) => {
      setMapProps(prev => ({
        ...prev,
        bounds
      }))
    },

    setRoutes: (routes) => {
      setMapProps(prev => ({
        ...prev,
        routes
      }))
    },

    getMapRef: () => {
      return new Promise(r=>{
        setMapProps(prev => ({
          ...prev,
          resolveMapRef: r
        }));
      });
    }
  }), [mapProps]);

  return (
    <MapInteractionContext.Provider value={contextValue}>
      {children}
    </MapInteractionContext.Provider>
  );
}
