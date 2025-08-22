import {createContext, useContext, useEffect, useMemo, useState} from "react";

const MapInteractionContext = createContext(undefined);

export function useMap() {
  const context = useContext(MapInteractionContext);
  if (!context) {
    throw new Error('useMapClick must be used within MapProvider');
  }
  return context;
}

export function MapProvider({ children }) {
  const [mapProps, setMapProps] = useState({
    onClick: null
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
      console.log(props);
      setMapProps(prev => ({
        ...prev,
        ...props,
        onClick: prev.onClick
      }))
    }
  }), [mapProps]);

  return (
    <MapInteractionContext.Provider value={contextValue}>
      {children}
    </MapInteractionContext.Provider>
  );
}
