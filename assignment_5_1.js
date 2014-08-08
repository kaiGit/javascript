// assignment 4-1

var assert = require("assert");
require("colors");
require('./logUtil.js');

function Graph(n) {
	this.n = n;
	this.map = new Array(n);
	this.distCache = {};
};

Graph.prototype.dist = function(from, to) {
	// from and to are indexes starting form 1
	var key = from.toString() + '_' + to.toString();
	if (key in this.distCache) {
		return this.distCache[key];
	}
	
	var fromCity = this.map[from - 1];
	var toCity = this.map[to - 1];
	var offsetX = fromCity.x - toCity.x;
	var offsetY = fromCity.y - toCity.y;
	this.distCache[key] = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
	return this.distCache[key];
};

function City(x, y) {
  this.x = x;
  this.y = y;
};

function assignment41(input) {
  var graph = readGraphFromFile(input);
  var tspResult = tsp(graph);
  console.log('result = '.red, tspResult);
  return;
}


function readGraphFromFile(input) {
  assert(input, "read tsp input, input is null");
  console.log('tsp input = '.grey, input);

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

    var graph = new Graph(n);

    console.log('n = '.blue, n);

    for (var i = 1; i <= n; ++i) {
      var line = lines[i];
      var lineSplit = line.trim().split(' ');

      var x = Number(lineSplit[0]);
      var y = Number(lineSplit[1]);

      graph.map[i-1] = new City(x, y);
    }

    assert(graph.map.length === n, "not enough edge");

    console.log("first item".blue, graph.map[0]);
    console.log("last item".blue, graph.map[graph.map.length - 1]);
    // console.log();

    return graph;
  }
}

function key(setAsArray, j) {
	// setAsArray must be an array, with keys sorted
	// from small to large
	var arrayFlags = arrayToBitFlag(setAsArray);
	return keyFlags(arrayFlags, j);
}

function keyFlags(arrayFlags, j) {
	var flag = j << 25;
	return flag | arrayFlags;
}

function tsp(graph) {
    var A = {};
	var B = {};
	var allCities = new Array(graph.n);
	
	// Base case
	A[key([1], 1)] = 0;
	for (var i = 2; i <= graph.n; ++i) {
		A[key([i], 1)] = Infinity;
	}
	
	// select souce in S
	for (var i = 1; i <= graph.n; ++i) {
		allCities[i-1] = i;
	}
	var allCitiesWithou1 = [];
	for (var i = 2; i <= graph.n; ++i) {
		allCitiesWithou1.push(i);
	}
	
	var S = [];
	var j = 0;
	var k = 0;
	for (var m = 2; m <= graph.n; ++m) {
		console.log('m = '.yellow + m.toString());
		// Compose set S that's of m size, and always contain 1, so the first of S must be 1	
		var arrayOfSwo1 = select(allCitiesWithou1, m-1); // populate arrayOfSwo1 of all possible S of m size
		console.log('finish prepare arrayOfSwo1', arrayOfSwo1.length);
		var arrayOfSwo1Len = arrayOfSwo1.length;
		for (var indexS = 0; indexS < arrayOfSwo1Len; ++indexS) {
			var Swo1 = arrayOfSwo1[indexS];
			var sFlag = arrayToBitFlag(Swo1); // sFlag is mising city 1
			sFlag |= 1 << 1; // city one is using 2;
			
			//if (S.length > 7) console.log('indexS = '.green, indexS);
			for (var indexJ = 1; indexJ < m; ++indexJ) {
				j = Swo1[indexJ-1];
				
				var key_Sj = keyFlags(sFlag, j);
				var temp = Infinity; // Use temp to hold for A[key]
				
				var ckj = Infinity;
				var SwoJFlags = sFlag ^ (1 << j);
				var key_swoj_k = '';
				var newPath = Infinity;
				
				for (var indexK = 0; indexK < m; ++indexK) {
					if (indexK == indexJ)
						continue;
					
					if (indexK === 0)
						k = 1;
					else
						k = Swo1[indexK-1];
						
					ckj = graph.dist(k, j);
					
					key_swoj_k = keyFlags(SwoJFlags, k);
					//console.log('key_swoj_k', key_swoj_k);
					//console.log('A[key_swoj_k', A[key_swoj_k]);
					//console.log('ckj', ckj);
					newPath = A[key_swoj_k] + ckj;
					if (newPath < temp) {
						temp = newPath;
					}
				}
				
				B[key_Sj] = temp;
			}
		}
		
		delete A;
		A = B;
		B = {};
	} // end of for (var m = ...
	
	var overall = Infinity;
	var cj1 = 0;
	var allSet = new Array(graph.n);
	for (var i = 1; i <= graph.n; ++i) {
		allSet[i-1] = i;
	}
	var keyAllSet = arrayToBitFlag(allSet);
	for (var j = 2; j <= graph.n; ++j) {
		var newKey = keyFlags(keyAllSet, j);
		cj1 = graph.dist(j, 1);
		var newPath = A[newKey] + cj1;
		if (newPath < overall) {
			overall = newPath;
		}
	}
	
	//console.log('A = '.white, A);
	
	return overall;
}

function select(source, count) {
	function sortNumber(a, b) {
		return a-b;
	}
	
	var flags = new Array(source.length);
	for (var i = 0; i < source.length; ++i) {
		flags[i] = 0;
	}
	
	var finalResult = [];
	var totalCount = 0;
	var len = source.length;
	
	function selectImpl(start) {
		if (totalCount === count) {
			// Exactly, output current array
			var oneResult = new Array(count);
			var elementCount = 0;
			for (var i = 0; i < len; ++i) {
				if (flags[i] === 1) {
					oneResult[elementCount] = source[i];
					++elementCount;
				}
			}
			finalResult.push(oneResult);
			return;
		}
			
		if (start >= len) {
			return;
		}
			
		// else, totalCount must be smaller than count	
		selectImpl(start+1);
		
		flags[start] = 1;
		++totalCount;
		selectImpl(start+1);
		--totalCount;
		flags[start] = 0;
	}
	
	selectImpl(0);
	
	return finalResult;
}

function arrayToBitFlag(array) {
	var arrayFlags = 0;
	var v;
	for (var i in array) {
		v = array[i];
		arrayFlags |= 1 << v;
	}
	return arrayFlags;
}

//assignment41('./testdata/tsp.txt');
module.exports.tsp = tsp;
module.exports.select = select;
module.exports.key = key;
module.exports.keyFlags = keyFlags;
module.exports.assignment41 = assignment41;
