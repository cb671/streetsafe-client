import 'maplibre-gl/dist/maplibre-gl.css';
import Map from "../components/Map.jsx";
import Icons from "../components/Icons.jsx";
import {useEffect, useState} from "react";
import {initialPosition, useMap} from "../contexts/MapContext.jsx";
import {Link, useNavigate} from "react-router";
import {calculateRoutes, geocode, reverseGeo, searchLocation} from "../api/api.js";
import {
  Route,
  ChevronLeft,
  LoaderPinwheel,
  Footprints,
  CornerUpLeft,
  CornerUpRight,
  MoveUpLeft,
  MoveUpRight, Cake
} from "lucide-react";
import {dev, routeColors, routeNames} from "../util/const.js";
import {formatSecs} from "../util/time.jsx";
import {calculateStepProgress} from "../util/go-progress.js";

function GoInput({id, children, value, onChange, required}){
  const [content, setContent] = useState(value || "");
  const [lastValue, setLastValue] = useState(value || "");

  useEffect(() => {
    value && setContent(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.currentTarget.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  return <label htmlFor={id} className={`input-group ${content.length > 0 ? "has-content" : ""}`}>
    <input required={required} type="text" name={id} id={id} value={content} onChange={handleChange}/>
    <span>{children}</span>
  </label>
}

function LocationEntry({id, children, onDecision, forceValue, bias}){
  const [potential, setPotential] = useState([]);
  const [chosen, setChosen] = useState();
  useEffect(() => {
    forceValue && setChosen(forceValue)
  }, [forceValue]);
  let apiTimeout;
  return <div className={`relative ${potential?.suggestions?.length > 0 ? "has-results" : ""}`}>
    <GoInput id={id} onChange={(value => {
      clearTimeout(apiTimeout);
      if(value.length < 3){
        setPotential([]);
        return setChosen(undefined);
      }
      apiTimeout = setTimeout(async() => {
        const res = await searchLocation(value, bias);
        setPotential(res);
        setChosen(undefined);
      }, 500);
    })} value={chosen?.formattedAddress}>
      {children}
    </GoInput>
    {potential?.suggestions?.length > 0 &&
      <div className={"bg-black/75 absolute flex flex-col gap-2 p-2 rounded-b-lg max-h-48 overflow-x-auto w-full z-10"}>
        {potential.suggestions.map(pobj => {
          const p = pobj.placePrediction;
          return <button type={"button"} key={p.placeId} onClick={e => {
            setPotential([]);
            setChosen({
              formattedAddress: p.text.text
            });
            geocode(p.placeId).then(place => {
              setChosen(place);
              onDecision(place);
            });
          }}
                         className={"outline-grey rounded-md p-2 outline-1 -outline-offset-1 text-sm flex flex-col gap-1 text-left"}>
            <span className={"font-bold"}>{p.structuredFormat.mainText.text}</span>
            <span className={"text-xs"}>{p.structuredFormat.secondaryText.text}</span>
          </button>
        })}
      </div>}
  </div>
}

function ChooseDestinations({onDecision, userPosition}){
  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const [yourLocation, setYourLocation] = useState(undefined);
  const {setLocation} = useMap();

  useEffect(() => {
    if(!!userPosition){
      setYourLocation({
        formattedAddress: "Your location"
      });
      setFrom({
        formattedAddress: "Your location",
        location: {
          latitude: userPosition[1],
          longitude: userPosition[0]
        }
      })
    }
  }, [userPosition]);

  useEffect(() => {
    from && to && onDecision(from, to);
  }, [from, to]);

  return <form className={"contents"}>
    <div className="flex gap-1 items-center">
      <Link className={"cursor-pointer"} to={"/"}>
        <ChevronLeft/>
      </Link>
      <h2>Where to?</h2>
    </div>
    <LocationEntry id={"from"} forceValue={yourLocation} onDecision={(value => {
      setFrom(value);
      setLocation(value.location);
    })}>
      Starting Location
    </LocationEntry>
    <LocationEntry id={"to"} onDecision={(value => {
      setTo(value);
    })} bias={from?.location || undefined}>
      Destination
    </LocationEntry>
  </form>
}

function placeToDisplay(place){
  return place?.addressComponents ? place.addressComponents.slice(0, 3).map(c => c.shortText || c.longText).join(", ") : place.formattedAddress
}

function ChooseRoute({routes, onDecision}){
  const [chosenRoute, setChosenRoute] = useState(undefined);
  const {setRoutes, fitBounds} = useMap();

  useEffect(() => {
    setRoutes(routes.map(r => {
      r.active = true;
      return r;
    }));
    if(routes.length === 0) return;
    const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
    for(const opt of routes){
      const route = opt.routes[0];
      for(const coord of route.geometry.coordinates){
        bounds[0][0] = Math.min(bounds[0][0], coord[0]);
        bounds[0][1] = Math.min(bounds[0][1], coord[1]);
        bounds[1][0] = Math.max(bounds[1][0], coord[0]);
        bounds[1][1] = Math.max(bounds[1][1], coord[1]);
      }
    }
    fitBounds(bounds);
  }, [routes]);

  return <>
    {routes?.length > 0 ? <>
      {routes.map((r, ri) => {
      const color = routeColors[r.crime_factor];
      const name = routeNames[r.crime_factor];
      return <>
        <button type={"button"} onClick={() => {
          setChosenRoute(ri);
          setRoutes(routes.map((r, cri) => {
            r.active = ri === cri;
            return r;
          }));
        }} key={ri}
                className={`${chosenRoute === ri ? "outline-whiteish/75" : "outline-grey"} rounded-md outline-1 -outline-offset-1 flex gap-2 overflow-hidden bg-black/75`}>
          <div style={{
            background: `rgb(${color[0]},${color[1]},${color[2]})`
          }} className={"w-2 h-full"}>

          </div>
          <div className={"flex-grow text-left"}>
            <h2>{name}</h2>
            <div className={"flex gap-1"}>
              <span>
                {r.routes[0].distance < 1000 ? <>
                  <span className={"font-bold"}>{Math.floor(r.routes[0].distance)}</span>m
                </> : <>
                  <span className={"font-bold"}>{(r.routes[0].distance / 1000).toFixed(1)}</span>km
                </>}
              </span>
              <span>-</span>
              {formatSecs(r.routes[0].duration)}
            </div>
          </div>
        </button>
      </>
    })}
    <button disabled={chosenRoute === undefined} onClick={() => {
      onDecision(chosenRoute);
    }} className={"btn mt-auto"}>
      <h2>Begin journey</h2>
    </button>
    </> : <>
      <span>There are no available routes to this location.</span>
    </>}
  </>
}

function DoRoute({route}){
  const {updateMapProps, setLocation, fitBounds, setRoutes, getMapRef} = useMap();
  const [si, setSi] = useState(0);

  const steps = route.routes[0].legs[0].steps;

  useEffect(() => {
    if(!navigator.geolocation) return;

    let bearing = 0;
    let position = null;
    let canBearingUpdate = false;

    const handleOrientation = (e) => {
      if(e.absolute && e.alpha !== null){
        bearing = 360 - e.alpha;
        if(!canBearingUpdate) return;
        setLocation({
          bearing: bearing,
          longitude: position.longitude,
          latitude: position.latitude,
          direct: true,
          offset: [0, 0]
        });
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);

    const watchId = navigator.geolocation.watchPosition(
      (geo) => {
        updateMapProps({
          userPosition: [
            geo.coords.longitude,
            geo.coords.latitude,
          ]
        });
        if(!position) setLocation({
          longitude: geo.coords.longitude,
          latitude: geo.coords.latitude,
          zoom: 15,
          pitch: 30,
          bearing: bearing,
          // direct: true,
          offset: [0, 0],
          callback: () => canBearingUpdate = true
        });
        position = geo.coords;
      },
      (err) => console.error("Geo error", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 1000
      }
    );

    let _si = si;
    const interval = setInterval(async() => {
      let step = steps[_si];
      let nextStep = (_si + 1) < steps.length && steps[_si + 1];
      let lat = position.latitude;
      let lon = position.longitude;
      if(!position) return;
      if(dev){
        const map = await getMapRef();
        const mapPos = map.getCenter();
        lat = mapPos.lat;
        lon = mapPos.lng;
      }
      const progress = calculateStepProgress(lat, lon, step, nextStep);
      if(progress > step.distance - Math.min(25, step.distance / 2)){
        _si++;
        setSi(_si);
      }
    }, 250);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      clearInterval(interval);

      position && setLocation({
        longitude: position.longitude,
        latitude: position.latitude,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        offset: [0, -(384 + 32) / 2]
      });
    }
  }, []);

  // so there is a crosshair for dev movement
  useEffect(() => {
    if(!dev) return;
    const el = document.createElement("div");
    el.setAttribute("style", "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 100%; width: 4px; height: 4px; z-index: 100000; pointer-events: none;");
    document.body.append(el);
    return () => el.remove();
  });

  return <div className={"flex gap-2 items-center flex-grow"}>
    <div className={"text-3xl"}>
      {(()=>{
        const iconSize = 36;
        switch(steps[si].maneuver.type){
          case "arrive":
            return <Cake size={iconSize}/>
          case "turn":
          case "end of road":
          case "fork":
          case "on ramp":
          case "off ramp":
          case "continue":
            switch(steps[si].maneuver.modifier){
              case "left":
              case "sharp left":
                return <CornerUpLeft size={iconSize}/>
              case "right":
              case "sharp right":
                return <CornerUpRight size={iconSize}/>
              case "slight left":
                return <MoveUpLeft size={iconSize}/>
              case "slight right":
                return <MoveUpRight size={iconSize}/>
            }
          default:
            return <Footprints size={iconSize}/>
        }
      })()}
    </div>
    <span>{steps[si].maneuver.instruction}</span>
  </div>
}

export default function Go(){
  const {updateMapProps, setLocation, fitBounds, setRoutes} = useMap();
  const nav = useNavigate();
  const [userPosition, setUserPosition] = useState(undefined);
  const [fromTo, setFromTo] = useState(undefined);
  const [routes, setRoutesState] = useState(undefined);
  const [chosenRoute, setChosenRoute] = useState(undefined);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geo => {
      updateMapProps({
        userPosition: [
          geo.coords.longitude,
          geo.coords.latitude,
        ]
      });
      setUserPosition([
        geo.coords.longitude,
        geo.coords.latitude
      ]);
      setLocation({
        longitude: geo.coords.longitude,
        latitude: geo.coords.latitude,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        offset: [0, -(384 + 32) / 2]
      });
    }, err => {
      alert("Please allow access to your location to use the geo feature.");
      nav("/");
    });

    return () => {
      setLocation(initialPosition);
      setRoutes(null);
    };
  }, []);

  return <>
    <div
      className={`${chosenRoute === undefined ? (!!fromTo && !!routes) ? "h-2/3" : "h-96" : "h-32"} go`}>
      {!fromTo ? <ChooseDestinations userPosition={userPosition} onDecision={async(from, to) => {
        setFromTo([from, to]);
        const calculated = await calculateRoutes(
          [from.location.longitude, from.location.latitude].map(parseFloat),
          [to.location.longitude, to.location.latitude].map(parseFloat)
        );
        setRoutesState(calculated);
      }}/> : chosenRoute === undefined ? <>
        <div className="flex gap-1 items-center">
          <button type={"button"} className={"cursor-pointer"} onClick={() => {
            setFromTo(undefined);
            setRoutes(null);
          }}>
            <ChevronLeft/>
          </button>
          <h2>Choose a route</h2>
        </div>
        <div className="flex gap-1 items-center">
          <Route/>
          <div className={"flex flex-col"}>
            <span className={"text-sm"}>{placeToDisplay(fromTo[0])}</span>
            <span>{placeToDisplay(fromTo[1])}</span>
          </div>
        </div>
        {!routes ? <div className={"m-auto"}>
          <LoaderPinwheel size={96} className={"spin"} strokeWidth={1.5}/>
        </div> : <>
          <ChooseRoute routes={routes} onDecision={ri => {
            setChosenRoute(ri);
            setRoutes(routes.map((r, cri) => {
              r.hidden = ri !== cri;
              r.go = !r.hidden;
              return r;
            }));
          }}/>
        </>}
      </> : <>
        <div className="flex gap-1 items-center">
          <button type={"button"} className={"cursor-pointer"} onClick={() => {
            setChosenRoute(undefined);
            setRoutes(routes.map((r, cri) => {
              r.hidden = false
              r.go = false;
              return r;
            }));
          }}>
            <ChevronLeft/>
          </button>
          <h2>Let's go!</h2>
        </div>
        <DoRoute route={routes[chosenRoute]}/>
      </>}
    </div>
  </>
}
