const express = require("express");
const dijkstra = require("./graph");
const drivers = require("./drivers");

const app = express();

/* Home route */
app.get("/", (req, res) => {
  res.send("🚖 AI Mini Uber backend is running. Use /ride");
});

/* Ride route */
app.get("/ride", (req, res) => {
  try {
    const pickup = "A";
    const drop = "D";

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

    // Safety check
    if (!nearestDriver) {
      return res.status(500).json({ error: "No driver found" });
    }

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

  } catch (error) {
    res.status(500).json({
      error: "Internal error",
      message: error.message
    });
  }
});

/* Port for Render */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Mini Uber server running");
});
