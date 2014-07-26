// assignment 4-1
var assert = require("assert");
require("colors");

function Edge(from, to, length) {
  this.from = from;
  this.to = to;
  this.len = length;
}

function Graph(n, m) {
  this.n = n;
  this.m = m;
  this.edges = new Array(m);
}

Graph.prototype.validate = function() {
  assert(this.n);
  assert(this.m);
  assert(this.edges);
  assert(this.edges.length === this.m);
}

Graph.prototype.clone = function() {
  this.validate();

  var newGraph = new Graph(this.n, this.m);
  for (var i = 0; i < this.m; ++i) {
    var edgeToCopy = this.edges[i];
    var edge = new Edge(edgeToCopy.from, edgeToCopy.to, edgeToCopy.len);
    newGraph.edges[i] = edge;
  }

  newGraph.validate();
  return newGraph;
}

function assignment41(input) {
  var graph = readGraphFromFile(input);
  var allPairDistance = computeAllPairShortestPath_Johnson(graph);

  if (allPairDistance === null)
    return null;

  // else find smallest one
  var smallest = Infinity;
  for (var u in allPairDistance) {
    for (var v in allPairDistance[u]) {
      if (u === v)
        continue;

      if (allPairDistance[u][v] < smallest)
        smallest = allPairDistance[u][v];
    }
  }

  return smallest;
}


function readGraphFromFile(input) {
  assert(input, "readGraphFromFile input is null");
  console.log('readGraphFromFile input = '.grey, input);

  var fs = require('fs');
  var data = fs.readFileSync(input, 'utf8');
  var graph = getFileContentCB(null, data);
  return graph;

  // Due to async nature of javascript, all logic after reading a file is here
  function getFileContentCB(error, data) {
    if (error) throw error;


    var lines = data.split('\n');
    var lineCount = lines.length;
    var temp = lines[0].split(' ');
    var n = Number(temp[0]);
    var m = Number(temp[1]);
    var graph = new Graph(n, m);

    console.log('n = '.blue, n);
    console.log('m = '.blue, m);

    for (var i = 1; i <= m; ++i) {
      var line = lines[i];
      var lineSplit = line.trim().split(' ');

      var from = Number(lineSplit[0]);
      var to = Number(lineSplit[1]);
      var len = Number(lineSplit[2]);

      graph.edges[i-1] = new Edge(from, to, len);
    }

    assert(graph.edges.length === graph.m, "not enough edge");

    console.log("first item".blue, graph.edges[0]);
    console.log("last item".blue, graph.edges[graph.edges.length - 1]);
    // console.log();

    return graph;
  }
}

// graph is a populated Graph object, with n, m and all m edges in this.edges.
// Return a Dictionary, distance[ [u, v] ] = shortest distance from u to v
function computeAllPairShortestPath_Johnson(orgGraph) {

  // console.log("org graph".white, graph);
  var graph = orgGraph.clone();

  var oldN = graph.n;
  var oldM = graph.m;

  // Add a virtual n+1 node, which has 0 edge to all other nodes
  graph.n += 1;
  graph.m += oldN;

  for (var i = 1; i <= oldN; ++i) {
    graph.edges.push(new Edge(oldN+1, i, 0));
  }

  assert(graph.edges.length === oldM + oldN, "temp graph with virtual node is wrong");
  graph.validate();

  // console.log("mod graph".white, graph);

  var vertexWeight = computeShortestPath_BellmanFord(graph, oldN + 1);
  // console.log("Belmonford score".red, vertexWeight);
  if (vertexWeight === null)
    return null;

  // revert to original map
  graph.n = oldN;
  graph.m = oldM;
  for (var i = 0; i < oldN; ++i) {
    graph.edges.pop();
  }

  graph.validate();

  // convertVertexWeight to array
  var weightArray = new Array(oldN + 1);
  for (var i = 1; i < oldN + 1; ++i) {
    if (i in vertexWeight) {
      weightArray[i] = vertexWeight[i];
    } else {
      assert.fail("some vertex doesn't have weight v:" + i.toString() + " " + vertexWeight[i]);
      weightArray[i] = 0;
    }
  }

  // Adjus edge length so they are all non-negative
  for (var i = 0; i < graph.edges.length; ++i) {
    var edge = graph.edges[i];
    edge.len = edge.len + weightArray[edge.from] - weightArray[edge.to];
    assert(edge.len >= 0, "some reweighted edge are negative");
  }
  graph.validate();

  // console.log("rewaited graph ".yellow, graph);

  // Use Dijekstra for each vertex
  var allPairDistance = {};
  for (var i = 1; i <= oldN; ++i) {
    var result = computeShortestPath_Dijkstra(graph, i);
    allPairDistance[i] = result;
  }

  // console.log('unadjusted all pair distance'.red, allPairDistance);

  // Re adjust by weight
  for (var u in allPairDistance) {
    for (var v in allPairDistance[u]) {
      assert(allPairDistance[u]);
      assert(v in allPairDistance[u]);

      // allPairDistance[u][v] can be undefined, because u v may not be reachable.
      // If they are reachable, then we need to adjust the length
      if (allPairDistance[u][v] !== Infinity) {
        allPairDistance[u][v] = allPairDistance[u][v] - weightArray[u] + weightArray[v];
      }
    }
  }

  return allPairDistance;
}

function computeAllPairShortestPath_FloydWarshall(graph) {
  var arrayUtil = require('./ArrayUtil.js');
  // console.log('fw input'.red, graph);
  var edgeDict = {};
  for (var i = 0; i < graph.edges.length; ++i) {
    var edge = graph.edges[i];
    edgeDict[ [edge.from, edge.to] ] = edge;
  }

  var n = graph.n;

  var dist = arrayUtil.Create3DAllo(n+1, n+1, n+1);

  // init
  for (var i = 1; i <= n; ++i) {
    for (var j = 1; j <= n; ++j) {
      if (i === j) {
        dist[0][i][j] = 0;
      } else {
        var edge = edgeDict[ [i, j] ];
        if (edge) {
          // console.log(i, j, edge);
          dist[0][i][j] = edge.len;
        } else {
          dist[0][i][j] = Infinity;
        }
      }
    }
  } // end of init dist

  // console.log("init dist".yellow, dist[0]);

  var temp = 0;
  var old = 0;
  for (var k = 1; k <= n; ++k) {
    for (var i = 1; i <= n; ++i) {
      for (var j = 1; j <= n; ++j) {
        old = dist[k-1][i][j];
        temp = dist[k-1][i][k] + dist[k-1][k][j];
        dist[k][i][j] = Math.min(temp, old);
      }
    }
    // console.log("dist".yellow + ' ' + k.toString().red, dist[k]);
  }

  // check for negative edge
  for (var i = 1; i <= n; ++i) {
      if (dist[n][i][i] < 0)
        return null;
  }

  return dist[n];
}

function computeShortestPath_BellmanFord(graph, startVertex) {
  // return a dict[ v ] ] = shortest distance from startVertex to v
  // or null if there's negative circle in graph.

  // How BellmanFord works
  // create shortest length table from previous limited edge count
  // cache table => distance [ (edgeCount, v) ]
  // 1. initially distance [ 0, v ] = Infinity;
  // 2. for each edge allowance, calculate
  //    distnce[i, v] = min(distance[i-1, v], min(distance[i-1, w], len(w, v)))
  //    If there's no change for a round, then exit
  // 3. Do it for n times, which is 1 more than maximum path (n-1) edges
  //    if there're negagive shortest path length, then there's negative circle
  var arrayUtil = require('./ArrayUtil.js');
  var n = graph.n;

  var edgesByDest = {};
  for (var i = 0; i < graph.m; ++i) {
    var edge = graph.edges[i];

    if (edge.to in edgesByDest) {
      edgesByDest[edge.to].push(edge);
    } else {
      edgesByDest[edge.to] = [edge];
    }
  }

  // console.log('edgesByDest'.white, edgesByDest);

  var distance = arrayUtil.Create2DAllo(n+1, n+1);
  for (var i = 1; i <= n; ++i) {
    distance[0][i] = Infinity;
  }
  distance[0][startVertex] = 0; // This is the only place where startVertex is used.

  for (i = 1; i <= n; ++i) {
    // calculate distance[i][v];
    var hasChange = false;


    for (var v = 1; v <= n; ++v) {

      var minDist = distance[i-1][v];
      distance[i][v] = minDist;

      if (v in edgesByDest) {
        var allInboundEdges = edgesByDest[v];
        for (var j = 0; j < allInboundEdges.length; ++j) {
          var edge = allInboundEdges[j];
          var newDist = distance[i-1][edge.from] + edge.len;
          if (newDist < minDist) {
            minDist = newDist;
          }
        }
      }

      if (minDist < distance[i][v]) {
        distance[i][v] = minDist;
        hasChange = true;
      }
    } // End of for (var v = 1)

    // console.log("iterate edge limit ", i, distance[i]);

    if (!hasChange)
      break;

  } // End of for (var i = 1)

  if (i == n+1) {
    return null;
  }

  var dist = {};
  for (var v = 1; v <= n; ++v) {
    dist[v] = distance[i][v];
  }

  return dist;

}


function computeShortestPath_Dijkstra(graph, startVertex) {
  // The way hot Dijkstra's shortest path algorithm works is
  // distance[startVertex] = 0;
  // distance[theRest] = Infinity;
  // Use greedy algorithm, for all reachable edges, calculated the shortest path of a dest node.
  var distance = {};
  var n = graph.n;
  var m = graph.m;

  // distance[startVertex] = 0;

  var edgesBySrc = {};
  for (var i = 0; i < m; ++i) {
    var edge = graph.edges[i];

    if (edge.from in edgesBySrc) {
      edgesBySrc[edge.from].push(edge);
    } else {
      edgesBySrc[edge.from] = [edge];
    }
  }

  // console.log("edgesBySrc", edgesBySrc);

  var Heap = require("heap");
  var edgeHeap = new Heap(function(a, b) {
    return a.len - b.len;
  });

  if (!(startVertex in edgesBySrc)) {
    var selfDist = {};
    selfDist[startVertex] = 0;
    return selfDist;
  }

  edgeHeap.push(new Edge(0, startVertex, 0));

  while (!edgeHeap.empty()) {

    var min = edgeHeap.pop();
    // console.log("new min edge ".white, distance);
    // console.log("min edge ".yellow, min);

    // distance always track shortest path distance, so a node will only be pushed into distance once
    if (min.to in distance) {
      continue;
    }

    // so min.len < distance[min.to];
    distance[min.to] = min.len;

    // Add edges caming out of min.to to edgeHeap
    if (min.to in edgesBySrc) {
      var newBatch = edgesBySrc[min.to];
      // console.log(newBatch);
      for (var i = 0; i < newBatch.length; ++i) {
        var edge = newBatch[i];
        // console.log("test edge".red, edge, edge.to in distance);
        if (!(edge.to in distance)) {
          var newEdge = new Edge(edge.from, edge.to, edge.len + min.len);
          // console.log("new edge ", newEdge);
          edgeHeap.push(newEdge);
        }
      }
    }

    // console.log("heap after 1 pop ".cyan, edgeHeap);

  } // End of while (!edgeHeap.empty()) {

  // For the other nodes that's not in distance, put them as Infinity
  for (var i = 1; i < n; ++i) {
    if (!i in distance) {
      distance[i] = Infinity;
    }
  }

  return distance;
}

module.exports.assignment41 = assignment41;
module.exports.readGraphFromFile = readGraphFromFile;
module.exports.computeShortestPath_BellmanFord = computeShortestPath_BellmanFord;
module.exports.computeShortestPath_Dijkstra = computeShortestPath_Dijkstra;
module.exports.computeAllPairShortestPath_Johnson = computeAllPairShortestPath_Johnson;
module.exports.computeAllPairShortestPath_FloydWarshall = computeAllPairShortestPath_FloydWarshall;


// assignment41('./testdata/test4_1_1.txt');
// assignment41('./testdata/test4_1_2.txt');
// assignment41('./testdata/test4_1_3.txt');
