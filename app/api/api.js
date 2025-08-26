import {dev} from "../util/const.js";

const API_ROOT = !dev ? '/api' : 'http://localhost:3000/api';

export function getMapData(){
  return fetch(API_ROOT + '/map').then(r => r.json())
}

export function getHexData(h3){
  return fetch(`${API_ROOT}/map/hexagon/${h3}`).then(r => r.json())
}

export function calculateRoutes(from, to){
  return fetch(`${API_ROOT}/go`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([from, to])
  }).then(r => r.json()).catch(err => ({message: err.toString()}))
}

export function searchLocation(query, bias){
  return fetch(`${API_ROOT}/go/search?q=${encodeURIComponent(query)}${bias ? ("&bias=" + bias.longitude + "," + bias.latitude) : ""}`, {
    method: "POST",
    credentials: "include"
  }).then(r => r.json()).catch(err => ({message: err.toString()}))
}

export function geocode(place){
  return fetch(`${API_ROOT}/go/geocode?place=${encodeURIComponent(place)}`, {
    method: "POST",
    credentials: "include"
  }).then(r => r.json()).catch(err => ({message: err.toString()}))
}

export function reverseGeo(lon, lat){
  return fetch(`${API_ROOT}/go/reverse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([lon, lat]),
    credentials: "include"
  }).then(r => r.json()).catch(err => ({message: err.toString()}))
}
