const express = require("express");
const app = express();

const dijkstra = require("./graph");
const predictFare = require("./fareModel");

// Drivers
const drivers = [
  { name: "Driver 1", location: "A" },
  { name: "Driver 2", location: "B" },
  { name: "Driver 3", location: "A" }
];

// Users for login
const users = [
  { username: "user1", password: "1234" },
  { username: "admin", password: "admin" }
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

// ==========================
// LOGIN ROUTE
// ==========================
app.get("/login", (req, res) => {
  const { username, password } = req.query;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({
      success: true,
      message: "Login successful",
      user: username
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
});

// ==========================
// RIDE ROUTE
// ==========================
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

// Home
app.get("/", (req, res) => {
  res.send("AI Mini Uber Backend Running with Login + ML Fare");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Mini Uber server running on port", PORT);
});
