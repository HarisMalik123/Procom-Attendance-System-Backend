const CsArea = [
  [24.856524, 67.264308],
  [24.856724, 67.265171],[(24.857024, 67.265089)],[(24.856833, 67.264219)],
];
const eeArea = [
  [24.856285, 67.263877],
  [24.856208, 67.263584],[(24.856919, 67.263406)],[(24.857002, 67.263699)],
];

const isPointInPolygon = (x, y, polygon) => {
  let inside = false;
  let n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    let [xi, yi] = polygon[i];
    let [xj, yj] = polygon[j];

    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
};

const isInsideAnyArea = (x, y) => {
  return isPointInPolygon(x, y, CsArea) || isPointInPolygon(x, y, eeArea);
};
export default isInsideAnyArea;