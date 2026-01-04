const express = require("express");
const dijkstra = require("./graph");
const drivers = require("./drivers");

const app = express();

// Test route
app.get("/ride", (req, res) => {
  const pickup = "D"; // passenger pickup point

  let nearestDriver = null;
  let minDistance = Infinity;

  // Find nearest driver
  for (let driver of drivers) {
    const result = dijkstra(driver.location, pickup);

    if (result.distance < minDistance) {
      minDistance = result.distance;
      nearestDriver = driver;
    }
  }

  res.json({
    pickupPoint: pickup,
    assignedDriver: nearestDriver.name,
    driverLocation: nearestDriver.location,
    distanceToPickup: minDistance
  });
});

app.listen(3000, () => {
  console.log("Mini Uber server running on port 3000");
});
