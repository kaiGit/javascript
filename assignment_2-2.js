// This is for assignment 2-1

var UnionFind = require('./UnionFind.js').UnionFind;

function assignment22(input, callback) {
  // console.log('input = ', input);
  var fs = require('fs');
  fs.readFile(input, 'utf8', getFileContentCB);

  // Due to async nature of javascript, all logic after reading a file is here
  function getFileContentCB(error, data) {
    if (error) throw error;


    var lines = data.split('\n');
    var lineCount = lines.length;
    var temp = lines[0].split(' ');
    var n = Number(temp[0]);
    var vertexList = new Array(n);
    var bitCount = Number(temp[1]);

    for (var i = 1; i <= n; ++i) {
      var line = lines[i];
      // if (i > lineCount - 3)
      //   console.log('last few lines', line);

      var lineSplit = line.trim().split(' ');
      if (lineSplit.length !== bitCount) {
        console.log('wrong line #', i, 'Value\'', line, '\'',
          'splited value count', lineSplit.length);
        break;
      }


      var newVertex = new Vertex(lineSplit);

      vertexList[i-1] = newVertex;
    }

    console.log('n = ' + n, ' bitCount = ' + bitCount);
    // console.log('read node# ', vertexList.length);
    // Do union find
    var remainingCluster = n;

    var uf = new UnionFind();
    for (var i = 0; i < n; ++i) {
  //    console.log(i, vertexList[i]);
      uf.add(vertexList[i].getId());
    }


    uf.mergeCallback = function () {
      --remainingCluster;
    };

  var inverse = function(baseId, pos) {
    var c = baseId[pos];
    var newC = (c === '0') ? '1' : '0';
    return baseId.substr(0, pos) + newC + baseId.substr(pos+1);
  };

  var inverse2 = function(baseId, pos1, pos2) {
    // pos1 < pos2
    var c1 = baseId[pos1];
    var c2 = baseId[pos2];
    var newC1 = (c1 === '0') ? '1' : '0';
    var newC2 = (c2 === '0') ? '1' : '0';

    return baseId.substr(0, pos1) + newC1 + baseId.substr(pos1+1, pos2-pos1-1)
     + newC2 + baseId.substr(pos2+1);
  };

    // Union all 1 distance edges
    for (var i = 0; i < n; ++i)
    {
      // for each vertex, alter 1 bit, and unioin its 1 distance nabour
      var base = vertexList[i];
      var baseId = base.getId();
      var valueArray = null;
      var newId = null;
      for (var j = 0; j < bitCount; ++j) {
        // valueArray = base.v.slice(0); // Shallow clone the array
        // valueArray[j] = 1 - valueArray[j]; // inverse one bit
        // newId = getId(valueArray);

        newId = inverse(baseId, j);

        //console.log('union1', baseId, newId);
        uf.union(baseId, newId);
      }
    }

    // Union all 2 distance edges
    for (var i = 0; i < n; ++i)
    {
      // for each vertex, alter 1 bit, and unioin its 1 distance nabour
      var base = vertexList[i];
      var baseId = base.getId();
      var valueArray = null;
      var newId = null;
      for (var j = 0; j < bitCount; ++j) {
        for (var k = j + 1; k < bitCount; ++k) {
          // valueArray = base.v.slice(0); // Shallow clone the array
          // valueArray[j] = 1 - valueArray[j]; // inverse one bit
          // valueArray[k] = 1 - valueArray[k]; // inverse one bit
          // newId = getId(valueArray);
          //
          newId = inverse2(baseId, j, k);

          //console.log('union2', baseId, newId);
          uf.union(baseId, newId);
        }
      }
    }

    // Done, print remainingCluster
    console.log('remainingCluster = %d', remainingCluster);
    var finalResult = uf.getClusterCount();
    console.log(finalResult);

    callback && callback(input);

    return;
    uf.debugPrint();
    var allLeads = uf.debugPrintAllLeadIds();

    {
      var leads = [];
      for(var x in allLeads) {
        leads.push(x);
      }

      var getDistance = function (id1, id2) {
          var len = id1.length;
          var dist = 0;
          for (var i = 0; i < len; ++i) {
            if (id1[i] !== id2[i]) {
              ++dist;
            }
          }
          return dist;
      };

      var size = leads.length;
      for(var i = 0; i < size; ++i) {
        for (var j = i+1; j < size; ++j) {
          console.log(leads[i], leads[j], getDistance(leads[i], leads[j]));
        }
      }

    }

  }

  function Vertex (valueList) {
    var size = valueList.length;
    this.v = new Array(size);

    for(var i = 0; i < size; ++i) {
      this.v[i] = valueList[Number(i)];
    }

    this.getId = function () {
      return getId(this.v);
    };
  }

  function getId(vertexValue) {
    return vertexValue.join('');
  }
}

exports.assignment22 = assignment22;
