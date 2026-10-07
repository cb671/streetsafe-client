import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Map,
  NavigationControl,
  ScaleControl,
  useControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { cellToBoundary, cellToLatLng, gridDisk } from "h3-js";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { getTweenedColorHsl } from "../util/color.js";
import { MapboxOverlay } from "@deck.gl/mapbox";
import "@deck.gl/widgets/stylesheet.css";
import { getMapData } from "../api/api.js";
import {
  PathLayer,
  PointCloudLayer,
  ScatterplotLayer,
  SolidPolygonLayer,
} from "@deck.gl/layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { routeColors } from "../util/const.js";
import { initialPosition } from "../contexts/MapContext.jsx";

export const colorRange = [
  [1, 152, 189, 255],
  [73, 227, 206, 255],
  [216, 254, 181, 255],
  [254, 237, 177, 255],
  [254, 173, 84, 255],
  [209, 55, 78, 255],
];

function DeckGLOverlay({ overlayOrder = 0, ...props }) {
  const overlay = useControl(() => new MapboxOverlay(props));

  overlay.setProps(props);

  useEffect(() => {
    const container = overlay.getCanvas()?.parentElement;

    if (container) {
      container.style.zIndex = String(overlayOrder);
      container.style.pointerEvents = "none";
    }
  }, [overlay, overlayOrder]);
  return null;
}

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
};

const HEX_COVERAGE = 0.8;
const HEX_ELEVATION_SCALE = 50;
const CRIME_DATA_MIN_ZOOM = 10;

export default function MapComponent({
  onClick,
  mode,
  userPosition,
  position,
  bounds,
  routes,
  resolveMapRef,
  userLocation,
  homeH3Cells = [],
}) {
  const [data, setData] = useState([]);
  const [geoPos, setGeoPos] = useState(userPosition);
  const [mapPos, setMapPos] = useState(position || initialPosition);
  const [zoom, setZoom] = useState(
    userLocation ? 11 : (position?.zoom ?? initialPosition.zoom),
  );

  const showCrimeData = zoom >= CRIME_DATA_MIN_ZOOM;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapDataLoaded, setMapDataLoaded] = useState(mode === "go");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showZoomMessage, setShowZoomMessage] = useState(false);
  const [lastFlight, setLastFlight] = useState(null);
  const mapRef = useRef();
  const activeIdx = 1;

  const homeDots = [];
  const homeFaces = [];
  const dotsPerEdge = 8;

  if (mode !== "go") {
    // Index the crime rows by their H3 ID.
    // Use globalThis.Map because this file imports a map component named Map.
    const crimeRowsbyCell = new globalThis.Map(
      data.map((row) => [row[0], row]),
    );

    for (const cell of new Set(homeH3Cells)) {
      // Find the crime data for this exact postcode cell.
      const matchingRow = crimeRowsbyCell.get(cell);

      // Use the same crime value and height scale as the displayed column.
      // Cells without crime data retain a ground-level outline.
      const crimeValue = matchingRow ? Number(matchingRow[activeIdx]) || 0 : 0;

      const elevation = crimeValue * HEX_ELEVATION_SCALE;

      // H3 returns the centre in latitude-first order.
      const [centreLat, centreLng] = cellToLatLng(cell);

      // Boundary coordinates are longitude-first because we pass true.
      const boundary = cellToBoundary(cell, true);

      // Shrink the boundary using the same coverage as the crime hexagons.
      const displayedBoundary = boundary.map(([lng, lat]) => [
        centreLng + (lng - centreLng) * HEX_COVERAGE,
        centreLat + (lat - centreLat) * HEX_COVERAGE,
      ]);

      if (matchingRow) {
        const colour = getTweenedColorHsl(
          Math.min(1, Math.max(0, crimeValue / 10)),
          colorRange,
        );

        homeFaces.push({
          polygon: displayedBoundary.map(([lng, lat]) => [lng, lat, elevation]),
          colour: [colour[0], colour[1], colour[2], colour[255]],
        });
      }

      // Place dots along every edge of the smaller boundary.
      for (let edge = 0; edge < displayedBoundary.length - 1; edge++) {
        const start = displayedBoundary[edge];
        const end = displayedBoundary[edge + 1];

        for (let dot = 0; dot < dotsPerEdge; dot++) {
          const fraction = dot / dotsPerEdge;

          homeDots.push([
            start[0] + (end[0] - start[0]) * fraction,
            start[1] + (end[1] - start[1]) * fraction,
            elevation,
          ]);
        }
      }
    }
  }

  console.log("Home highlight rendering:", {
    mode,
    mapLoaded,
    cells: homeH3Cells,
    dotCount: homeDots.length,
    firstDot: homeDots[0],
  });

  const layers = [];
  const highlightLayers = [];

  if (mode === "go") {
    if (data.length === 0 || data[0].crime_factor !== undefined) {
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
          if (d.go) return routeColors[-1];
          return routeColors[d.crime_factor].map((v, i) =>
            i === 3 ? (d.hidden ? 0 : v) : d.active ? v : v / 3,
          );
        },
        getPath: (d) => {
          return d.routes[0].geometry.coordinates.map((c) => {
            return [c[0], c[1], d.go ? 0 : d.active ? 1 : 0];
          });
        },
      });

      layers.push(routesLayer);
    }

    if (geoPos) {
      const layer = new PointCloudLayer({
        id: "PointCloudLayer",
        data: [
          { position: [0, 0, 0], normal: [1, 1, 1], color: [96, 165, 250] },
        ],

        getColor: (d) => d.color,
        getNormal: (d) => d.normal,
        getPosition: (d) => d.position,
        pointSize: 6,
        parameters: {
          depthTest: false,
        },
        coordinateOrigin: geoPos,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        material,
        layerIndex: 1000,
      });

      layers.push(layer);
    }
  } else {
    const layer = new H3HexagonLayer({
      id: "hexagons",
      data,
      pickable: true,
      highPrecision: true,
      getHexagon: (d) => d[0],
      getElevation: (d) => Number(d[activeIdx]) || 0,
      getFillColor: (d) =>
        getTweenedColorHsl(
          Math.min(1, Math.max(0, d[activeIdx] / 10)),
          colorRange,
        ),
      extruded: true,
      material,

      opacity: 0.4,
      coverage: HEX_COVERAGE,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 100],
      elevationScale: HEX_ELEVATION_SCALE,

      onClick: (info) => {
        if (!info.object) return;

        if (!showCrimeData) {
          setShowZoomMessage(true);
          return;
        }

        setShowZoomMessage(false);
        onClick && onClick(info.object);
      },
    });

    layers.push(layer);

    // NEW: draw the selected hexagon's opaque top face.
    if (homeDots.length > 0) {
      highlightLayers.push(
        new SolidPolygonLayer({
          id: "home-postcode-faces",
          data: homeFaces,
          getPolygon: (face) => face.polygon,
          getFillColor: (face) => face.colour,
          positionFormat: "XYZ",
          filled: true,
          extruded: false,
          opacity: 1,
          pickable: false,
          paramters: {
            depthCompare: "always",
            depthWriteEnabled: false,
          },
        }),
      );
    }

    if (homeDots.length > 0) {
      const homeDotsLayer = new ScatterplotLayer({
        id: "home-postcode-dots",
        data: homeDots,
        getPosition: (dot) => dot,
        radiusUnits: "pixels",
        getRadius: 3,
        getFillColor: [255, 0, 255, 255],
        stroked: true,
        getLineColor: [255, 255, 255, 255],
        lineWidthUnits: "pixels",
        getLineWidth: 1,
        pickable: false,
        parameters: {
          depthCompare: "always",
          depthWriteEnabled: false,
        },
      });

      highlightLayers.push(homeDotsLayer);
    }
  }

  useEffect(() => {
    let isCancelled = false;
    let progressTimer;
    let completeTimer;

    setData([]);
    setLoadingProgress(0);

    if (mode !== "go") {
      setMapDataLoaded(false);

      progressTimer = window.setInterval(() => {
        setLoadingProgress((prev) => Math.min(prev + 6, 95));
      }, 140);

      const completeLoading = () => {
        if (isCancelled) return;
        setLoadingProgress(100);
        completeTimer = window.setTimeout(() => {
          if (!isCancelled) setMapDataLoaded(true);
        }, 180);
      };

      getMapData()
        .then((d) => {
          if (isCancelled) return;
          setData(d);
          completeLoading();
        })
        .catch((error) => {
          console.error("Failed to fetch map data", error);
          completeLoading();
        });
    } else {
      setMapDataLoaded(true);
    }

    return () => {
      isCancelled = true;
      if (progressTimer) window.clearInterval(progressTimer);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, [mode]);

  useEffect(() => {
    setGeoPos(userPosition);
  }, [userPosition]);

  useEffect(() => {
    if (!!bounds && mapRef.current)
      mapRef.current.fitBounds(bounds, {
        padding: {
          bottom: (window.screen.availHeight / 3) * 2 + 32,
          top: 32,
          left: 32,
          right: 32,
        },
        pitch: 0,
      });
  }, [bounds]);

  useEffect(() => {
    if (!routes) return setData([]);
    setData(routes);
  }, [routes]);

  useEffect(() => {
    if (showCrimeData || mode === "go") {
      setShowZoomMessage(false);
    }
  }, [showCrimeData, mode]);

  const updateMapPos = (pos) => {
    if (!pos) return;

    const flyTo = {};

    if (pos.longitude !== undefined && pos.latitude !== undefined) {
      flyTo.center = [pos.longitude, pos.latitude];
    }
    if (pos.zoom !== undefined) flyTo.zoom = pos.zoom;
    if (pos.pitch !== undefined) flyTo.pitch = pos.pitch;
    if (pos.bearing !== undefined) flyTo.bearing = pos.bearing;
    if (pos.offset) flyTo.offset = pos.offset;

    setLastFlight(pos);

    if (mapRef.current.isMoving() || mapRef.current.isRotating()) return;
    if (pos.direct) mapRef.current.jumpTo(flyTo);
    else mapRef.current.flyTo(flyTo);
    if (pos.callback) pos.callback();
  };

  useEffect(() => {
    if (mapLoaded && position) updateMapPos(position);
    setMapPos(position || initialPosition);
  }, [position]);

  const onMapLoad = useCallback(() => {
    const center = mapRef.current?.getCenter();

    setZoom(mapRef.current?.getZoom() ?? mapPos?.zoom ?? initialPosition.zoom);

    console.log("Map loaded:", {
      center,
      mapPos,
      zoom: mapRef.current?.getZoom(),
    });

    setMapLoaded(true);
    updateMapPos(mapPos);
  }, [mapPos]);

  useEffect(() => {
    resolveMapRef && resolveMapRef(mapRef?.current || false);
  }, [resolveMapRef]);

  useEffect(() => {
    if (userLocation && mapRef.current && mapLoaded) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 11,
        duration: 2000,
      });
    }
  }, [userLocation, mapLoaded]);

  const getInitialViewState = () => {
    if (userLocation) {
      return {
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 11,
        bearing: 0,
        pitch: 0,
      };
    }

    return {
      longitude: mapPos?.longitude ?? initialPosition.longitude,
      latitude: mapPos?.latitude ?? initialPosition.latitude,
      zoom: mapPos?.zoom ?? initialPosition.zoom,
      bearing: mapPos?.bearing ?? initialPosition.bearing,
      pitch: mapPos?.pitch ?? initialPosition.pitch,
    };
  };

  return (
    <div className="streetsafe-map" style={{ position: "relative" }}>
      {/* Loading indicator */}

      {mode !== "go" && !showCrimeData && showZoomMessage && (
        <div
          role="status"
          style={{
            position: "absolute",
            top: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            maxWidth: "calc(100% - 32px)",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            color: "#f8fafc",
            fontWeight: 600,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <span>
            Please zoom in to see crime data. Crime data is only available at
            zoom level 10 and above.
          </span>
        </div>
      )}

      {!mapDataLoaded && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            color: "#f8fafc",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.2)",
          }}
          aria-live="polite"
        >
          <span>Loading map data...</span>
          <div
            style={{
              width: 140,
              height: 6,
              borderRadius: 999,
              backgroundColor: "rgba(248, 250, 252, 0.2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: "#38bdf8",
                transition: "width 0.2s ease-out",
              }}
            />
          </div>
          <span>{loadingProgress}%</span>

          {loadingProgress >= 95 && (
            <span>
              Please do not refresh your browser, the data will load shortly
            </span>
          )}
        </div>
      )}
      <Map
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        initialViewState={getInitialViewState()}
        ref={mapRef}
        minZoom={5}
        maxZoom={initialPosition.maxZoom}
        doubleClickZoom={false}
        attributionControl={false}
        onLoad={onMapLoad}
        onZoom={(e) => setZoom(e.viewState.zoom)}
      >
        <DeckGLOverlay
          overlayOrder={0}
          layers={mapLoaded ? layers : []}
          interleaved={false}
        />

        <DeckGLOverlay
          overlayOrder={1}
          layers={mapLoaded ? highlightLayers : []}
          interleaved={false}
        />

        <NavigationControl />
        <ScaleControl position={"top-left"} />
      </Map>
    </div>
  );
}
