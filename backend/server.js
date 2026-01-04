const express = require("express");
const dijkstra = require("./graph");
const drivers = require("./drivers");

const app = express();

app.get("/ride", (req, res) => {
  const pickup = "A";   // passenger pickup
  const drop = "D";     // passenger drop

  let nearestDriver = null;
  let minDistance = Infinity;

  // Find nearest driver to pickup
  for (let driver of drivers) {
   for (let driver of drivers) {
  const result = dijkstra(driver.location, pickup);

  // simple AI score (distance based)
  const score = result.distance;

  if (score < minDistance) {
    minDistance = score;
    nearestDriver = driver;
  }
}

    if (result.distance < minDistance) {
      minDistance = result.distance;
      nearestDriver = driver;
    }
  }

  // Find route from pickup to drop
  const rideRoute = dijkstra(pickup, drop);

  res.json({
    pickup,
    drop,
    assignedDriver: nearestDriver.name,
    driverFrom: nearestDriver.location,
    driverDistance: minDistance,
    rideDistance: rideRoute.distance,
    path: rideRoute.path
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Mini Uber server running");
});
