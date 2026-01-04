// Graph representation (city map)
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, D: 5 },
  C: { A: 2, D: 8 },
  D: { B: 5, C: 8 }
};

// Simple Dijkstra algorithm
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

  for (let i = 0; i < 4; i++) {
    let minNode = null;

    for (let node in distances) {
      if (!visited[node] && (minNode === null || distances[node] < distances[minNode])) {
        minNode = node;
      }
    }

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
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { distance: distances[end], path };
}

module.exports = dijkstra;
