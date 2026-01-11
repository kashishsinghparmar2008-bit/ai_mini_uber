const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

/* =========================
   MOCK CITY GRAPH (DSA)
========================= */
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, D: 5 },
  C: { A: 2, D: 8 },
  D: { B: 5, C: 8 }
};

/* =========================
   DRIVERS DATA
========================= */
const drivers = [
  { name: "Driver 1", location: "A" },
  { name: "Driver 2", location: "B" },
  { name: "Driver 3", location: "C" }
];

/* =========================
   RIDE HISTORY (for demand)
========================= */
let rideHistory = [];

/* =========================
   DIJKSTRA ALGORITHM
========================= */
function dijkstra(start, end) {
  const distances = {};
  const visited = {};
  const previous = {};

  for (let node in graph) {
    distances[node] = Infinity;
    visited[node] = false;
    previous[node] = null;
  }

  distances[start] = 0;

  for (let i = 0; i < Object.keys(graph).length; i++) {
    let minNode = null;
    let minDistance = Infinity;

    for (let node in distances) {
      if (!visited[node] && distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }

    if (!minNode) break;

    visited[minNode] = true;

    for (let neighbor in graph[minNode]) {
      let newDist = distances[minNode] + graph[minNode][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = minNode;
      }
    }
  }

  // Build path
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { distance: distances[end], path };
}

/* =========================
   SIMPLE ML FARE MODEL
========================= */
function predictFare(distance) {
  const baseFare = 50;
  const perKmRate = 15;
  return Math.round(baseFare + distance * perKmRate);
}

/* =========================
   DEMAND FORECAST MODEL
========================= */
function getHighDemandArea() {
  if (rideHistory.length === 0) return null;

  const freq = {};
  rideHistory.forEach(loc => {
    freq[loc] = (freq[loc] || 0) + 1;
  });

  let max = 0;
  let high = null;

  for (let loc in freq) {
    if (freq[loc] > max) {
      max = freq[loc];
      high = loc;
    }
  }

  return high;
}

/* =========================
   🔓 OPEN LOGIN (ANYONE)
========================= */
app.get("/login", (req, res) => {
  const { username, password } = req.query;

  if (username && password) {
    res.json({
      success: true,
      message: "Login successful",
      user: username
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Please enter username and password"
    });
  }
});

/* =========================
   🚖 BOOK RIDE API
========================= */
app.get("/ride", (req, res) => {
  const pickup = "A";
  const drop = "D";

  const route = dijkstra(pickup, drop);

  // Find nearest driver
  let bestDriver = null;
  let minDistance = Infinity;

  drivers.forEach(driver => {
    const d = dijkstra(driver.location, pickup).distance;
    if (d < minDistance) {
      minDistance = d;
      minDistance = d;
      bestDriver = driver;
    }
  });

  const fare = predictFare(route.distance);

  rideHistory.push(pickup);

  const highDemandArea = getHighDemandArea();

  res.json({
    pickup,
    drop,
    assignedDriver: bestDriver.name,
    driverFrom: bestDriver.location,
    driverDistance: minDistance,
    rideDistance: route.distance,
    path: route.path,
    fare,
    highDemandArea
  });
});

/* =========================
   🔥 HEATMAP API
========================= */
app.get("/heatmap", (req, res) => {
  res.json({
    heatmapData: rideHistory.slice(-10)
  });
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 AI Mini Uber backend running on port ${PORT}`);
});

