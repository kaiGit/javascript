require("colors");

var a41 = require('./assignment_4_1.js');

var graph = a41.readGraphFromFile('./testdata/test4_1_4.txt');
var distance = a41.computeShortestPath_BellmanFord(graph, 1);
console.log(distance, ' expectation ', { '1': 0, '2': 5, '3': 1, '4': -1 });
var distance = a41.computeShortestPath_Dijkstra(graph, 1);
console.log(distance, ' expectation ', { '1': 0, '2': 5, '3': 1, '4': 3 });
var allDistance = a41.computeAllPairShortestPath_Johnson(graph);
console.log('all pair js'.red, allDistance);
var allDistance = a41.computeAllPairShortestPath_FloydWarshall(graph);
console.log('all pair fw'.red, allDistance);
var a41Result = a41.assignment41('./testdata/test4_1_4.txt');
console.log('a41'.white, a41Result);
console.log();


var graph = a41.readGraphFromFile('./testdata/test4_1_5_negative_circle.txt');
var distance = a41.computeShortestPath_BellmanFord(graph, 1);
console.log(distance, ' expectation ', null);
var distance = a41.computeShortestPath_Dijkstra(graph, 1);
console.log(distance, ' expectation ', 'any crap but always fail');
var allDistance = a41.computeAllPairShortestPath_Johnson(graph);
console.log('all pair js'.red, allDistance);
var allDistance = a41.computeAllPairShortestPath_FloydWarshall(graph);
console.log('all pair fw'.red, allDistance);

var a41Result = a41.assignment41('./testdata/test4_1_5_negative_circle.txt');
console.log('a41'.white, a41Result);
console.log();

var graph = a41.readGraphFromFile('./testdata/test4_1_6.txt');
var distance = a41.computeShortestPath_BellmanFord(graph, 1);
console.log(distance, ' expectation ', { '1': 0, '2': 5, '3': 1, '4': -1 });
var distance = a41.computeShortestPath_Dijkstra(graph, 1);
console.log(distance, ' expectation ', { '1': 0, '2': 5, '3': 2, '4': -1 });
var allDistance = a41.computeAllPairShortestPath_Johnson(graph);
console.log('all pair js'.red, allDistance);
var allDistance = a41.computeAllPairShortestPath_FloydWarshall(graph);
console.log('all pair fw'.red, allDistance);
var a41Result = a41.assignment41('./testdata/test4_1_6.txt');
console.log('a41'.white, a41Result);
console.log();

var graph = a41.readGraphFromFile('./testdata/test4_1_7.txt');
var distance = a41.computeShortestPath_BellmanFord(graph, 5);
console.log(distance, ' expectation ', { '1': 0, '2': 5, '3': 1, '4': -1 });
var distance = a41.computeShortestPath_Dijkstra(graph, 5);
console.log(distance, ' expectation ', { '1': 0, '2': 0, '3': 0, '4': 0 });
var allDistance = a41.computeAllPairShortestPath_Johnson(graph);
console.log('all pair js'.red, allDistance);
var allDistance = a41.computeAllPairShortestPath_FloydWarshall(graph);
console.log('all pair fw'.red, allDistance);
var a41Result = a41.assignment41('./testdata/test4_1_7.txt');
console.log('a41'.white, a41Result);
console.log();

/*
var a41Result = a41.assignment41('./testdata/test4_1_1.txt');
console.log('a41'.white, a41Result);

var a41Result = a41.assignment41('./testdata/test4_1_2.txt');
console.log('a41'.white, a41Result);

var a41Result = a41.assignment41('./testdata/test4_1_3.txt');
console.log('a41'.white, a41Result);
*/
