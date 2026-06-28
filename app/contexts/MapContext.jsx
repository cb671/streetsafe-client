import {createContext, useCallback, useContext, useMemo, useState} from "react";

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

  const setClickHandler = useCallback((handler) => {
    setMapProps(prev => ({
      ...prev,
      onClick: handler
    }));
  }, []);

  const clearClickHandler = useCallback(() => {
    setMapProps(prev => ({
      ...prev,
      onClick: null
    }));
  }, []);

  const updateMapProps = useCallback((props) => {
    setMapProps(prev => ({
      ...prev,
      ...props,
      onClick: prev.onClick
    }));
  }, []);

  const setLocation = useCallback((pos) => {
    setMapProps(prev => ({
      ...prev,
      position: pos
    }));
  }, []);

  const fitBounds = useCallback((bounds) => {
    setMapProps(prev => ({
      ...prev,
      bounds
    }));
  }, []);

  const setRoutes = useCallback((routes) => {
    setMapProps(prev => ({
      ...prev,
      routes
    }));
  }, []);

  const getMapRef = useCallback(() => {
    return new Promise(r=>{
      setMapProps(prev => ({
        ...prev,
        resolveMapRef: r
      }));
    });
  }, []);

  const contextValue = useMemo(() => ({
    mapProps,
    setClickHandler,
    clearClickHandler,
    updateMapProps,
    setLocation,
    fitBounds,
    setRoutes,
    getMapRef
  }), [
    mapProps,
    setClickHandler,
    clearClickHandler,
    updateMapProps,
    setLocation,
    fitBounds,
    setRoutes,
    getMapRef
  ]);

  return (
    <MapInteractionContext.Provider value={contextValue}>
      {children}
    </MapInteractionContext.Provider>
  );
}
