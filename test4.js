var a41 = require('./assignment_4_1.js');

var graph = a41.readGraphFromFile('./testdata/test4_1_large.txt');
var a41Result = a41.computeAllPairShortestPath_FloydWarshall(graph);
