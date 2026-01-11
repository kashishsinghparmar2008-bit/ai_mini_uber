const express = require("express");
const app = express();

const dijkstra = require("./graph");
const predictFare = require("./fareModel");

const drivers = [
  { name: "Driver 1", location: "A" },
  { name: "Driver 2", location: "B" },
  { name: "Driver 3", location: "A" }
];

// Find nearest driver
function findNearestDriver(pickup) {
  let minDistance = Infinity;
  let nearestDriver = null;

  for (let driver of drivers) {
    const result = dijkstra(driver.location, pickup);

    if (result.distance < minDistance) {
      minDistance = result.distance;
      nearestDriver = driver;
    }
  }

  return nearestDriver;
}

app.get("/ride", (req, res) => {
  const pickup = "A";
  const drop = "D";

  const rideRoute = dijkstra(pickup, drop);
  const rideDistance = rideRoute.distance;

  const nearestDriver = findNearestDriver(pickup);

  // ML-based fare prediction
  const fare = predictFare(rideDistance);

  res.json({
    pickup,
    drop,
    assignedDriver: nearestDriver.name,
    driverFrom: nearestDriver.location,
    rideDistance,
    path: rideRoute.path,
    fare
  });
});

app.get("/", (req, res) => {
  res.send("AI Mini Uber Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Mini Uber server running on port", PORT);
});
