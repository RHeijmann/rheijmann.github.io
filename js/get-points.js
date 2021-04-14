/*
  Example: calculatePoints([{ "x": 0, "y": 100}, { "x": 90,  "y": 33}], 7, 12)
*/
const calculatePoints = (points, steps, deviation) => {
    const data = [];

    for (let i = 0; i < points.length - 1; i++) {
      const ascendingX = (points[i].x - points[i + 1].x) < 0
      const ascendingY = (points[i].y - points[i + 1].y) < 0

      const diffX = Math.abs((points[i].x - points[i + 1].x) / steps);
      const diffY = Math.abs((points[i].y - points[i + 1].y) / steps);

      for (let k = 0; k < steps; k++) {
        const currentX = ascendingX ? points[i].x + (k * diffX) : points[i ].x - (k * diffX);
        const currentY = ascendingY ? points[i].y + (k * diffY) : points[i].y - (k * diffY);
        
        if (k % 2 == 0) { // even
          data.push({ "x": currentX, "y": currentY + deviation});
        } else { // odd
          data.push({ "x": currentX, "y": currentY - deviation});
        }
      } 
    }

    return data;
  };
