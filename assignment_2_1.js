// This is for assignment 2-1

var UnionFind = require('./UnionFind.js').UnionFind;

var input = '/Users/kai/programming/Algorithm_II/Assignment_2-1/clustering1.txt';

var fs = require('fs');
fs.readFile(input, 'utf8', getFileContentCB);

// Due to async nature of javascript, all logic after reading a file is here
function getFileContentCB(error, data) {
  if (error) throw error;

  console.log(typeof(data));

  var lines = data.split('\n');
  var lineCount = lines.length;
  var n = Number(lines[0]);
  var edgeCount = lineCount - 1;
  var edges = Array();
  var distanceDict = {}
  for (var i = 1; i < lineCount; ++i) {
    var line = lines[i];
    if (i > lineCount - 3)
      console.log(line);

    var lineSplit = line.split(' ');
    if (lineSplit.length !== 3)
      break;

    var v1 = Number(lineSplit[0]);
    var v2 = Number(lineSplit[1]);
    var distance = Number(lineSplit[2]);

    edges.push(new Edge(v1, v2, distance));

    distanceDict[v1.toString() + '_' + v2.toString()] = distance;
    distanceDict[v2.toString() + '_' + v1.toString()] = distance;
  }

  console.log('n = ' + n);
  console.log('edges.length = ' + edges.length);

  console.log('before sort', edges[0], edges[edges.length - 1]);

  // sort edges by their distance, ascendingly.
  edges.sort(function (a, b){
      return a.distance - b.distance;
  });

  console.log('after sort', edges[0], edges[edges.length - 1]);

  var uf = new UnionFind();
  var remainingCluster = n;
  var TARGET_CLUSTER = 4;
  uf.mergeCallback = function(id1, id2) {
    --remainingCluster;
    mergeCallback(id1, id2);

    if (remainingCluster === TARGET_CLUSTER)
    {
        // Now I can calculate the maximum spacing
        console.log('cluster finished');
        //uf.debugPrintAllLeadIds();

        var minSpace = null;
        for (var i = 1; i <= n; ++i) {
          for (var j = i; j <= n; ++j) {
            var lead1 = uf.find(i);
            var lead2 = uf.find(j);
            if (lead1 !== lead2) {
              // get the distance between i, j
              var distance = distanceDict[i.toString() + '_' + j.toString()];
              if (!minSpace || distance < minSpace)
                minSpace = distance;
            }
          }
        }
        console.log("minSpace = " + minSpace);

    }
  }

  for (var i = 1; i <=n; ++i)
    uf.add(i);

  var edgeCount = edges.length;
  for (var i = 0; i < edgeCount; ++i) {
    if (remainingCluster <= TARGET_CLUSTER)
      break;

    uf.union(edges[i].v1, edges[i].v2);
  }
}

function Edge(v1, v2, distance) {
  this.v1 = v1;
  this.v2 = v2;
  this.distance = distance;
}

function mergeCallback(id1, id2) {
  //console.log('merged ' + id1 + ' ' + id2)
}
