export const calculateStepProgress = (lat, lon, step, nextStep) => {
  let coords = step.geometry.coordinates;
  if(nextStep) coords.push(...nextStep.geometry.coordinates);

  let minDist = Infinity;
  let closestIdx = 0;
  let segDist = 0;

  // Find the closest segment and interpolate
  for(let i = 0; i < coords.length - 1; i++){
    const [lon1, lat1] = coords[i];
    const [lon2, lat2] = coords[i + 1];

    const segLen = calculateDistance(lat1, lon1, lat2, lon2);
    if(segLen === 0) continue;


    // dot product
    const A = lat - lat1;
    const B = lon - lon1;
    const C = lat2 - lat1;
    const D = lon2 - lon1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let p = lenSq !== 0 ? dot / lenSq : -1;

    let closestLat, closestLon;
    if(p < 0){
      closestLat = lat1;
      closestLon = lon1;
      p = 0;
    }else if(p > 1){
      closestLat = lat2;
      closestLon = lon2;
      p = 1;
    }else{
      closestLat = lat1 + p * C;
      closestLon = lon1 + p * D;
    }

    const dist = calculateDistance(lat, lon, closestLat, closestLon);

    if(dist < minDist){
      minDist = dist;
      closestIdx = i;
      segDist = p * segLen;
    }
  }

  let progress = 0;
  for(let i = 1; i <= closestIdx; i++){
    progress += calculateDistance(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]);
  }
  progress += segDist;

  return progress;
}

// calculate distance between coords in m using haversine formula
// reference: https://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/
function calculateDistance(lat1, lon1, lat2, lon2){
  const R = 6371000; // earth's radius in meters

  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const latDelta = (lat2 - lat1) * Math.PI / 180;
  const lonDelta = (lon2 - lon1) * Math.PI / 180;

  // a = sin²(ΔlatDifference/2) +
  const a = Math.pow(Math.sin(latDelta / 2), 2) +
    //cos(lat1).cos(lt2).
    Math.cos(p1) * Math.cos(p2) *
    //.sin²(ΔlonDifference/2)
    Math.pow(Math.sin(lonDelta / 2), 2);

  // c = 2.atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
