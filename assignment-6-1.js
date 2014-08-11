// node
// assignment_6-1

var assert = require("assert");
require("colors");
require('./logUtil.js');

function assignment61(input) {
  var _2satQus = read2SatQuestionFromFile(input);
  var isSatisfiable = checkIsSatisfiable(_2satQus);
  var returnValue = isSatisfiable ? 1 : 0;
  return returnValue;
}

function Clause(signX, idX, signY, idY) {
  this.signX = signX;
  this.idX = idX;
  this.signY = signY;
  this.idY = idY;
}

function SatQuestion(size) {
  this.size = size;
  this.variables = new Array(size+1); // start from 1, so it matches the input
  for (var i = 0; i <= size; ++i) {
    this.variables[i] = false;
  }
  this.clauses = new Array(size);
}

SatQuestion.prototype.IsSatisfied = function () {
  for (var i = 0; i < this.size; ++i) {
    if (!this.IsClauseSatisfied(this.clauses[i]))
      return false;
  }

  return true;
}

SatQuestion.prototype.IsClauseSatisfied = function (clause) {
  var x = this.variables[clause.idX];
  var y = this.variables[clause.idY];

  // if signX , then eval(x) = x
  // else if !signX, eval(x) = !x;
  // so eval (x) is (signX === x);
  return (x === clause.signX) || (y === clause.signY);
}


function read2SatQuestionFromFile(input) {
  assert(input, "read tsp input, input is null");
  console.log('2sat input = '.grey, input);

  var fs = require('fs');
  var data = fs.readFileSync(input, 'utf8');
  var question = getFileContentCB(null, data);
  return question;

  // Due to async nature of javascript, all logic after reading a file is here
  function getFileContentCB(error, data) {
    if (error) throw error;

    var lines = data.split('\n');
    var lineCount = lines.length;
    var temp = lines[0].split(' ');
    var n = Number(temp[0]);

    var satQus = new SatQuestion(n);

    console.log('n = '.blue, n);

    var makeClause = function (x, y) {
      var idX = Math.abs(x);
      var idY = Math.abs(y);

      var getSign = function(v) {
        return (v>0);
      };

      var signX = getSign(x);
      var signY = getSign(y);

      return new Clause(signX, idX, signY, idY);
    }

    for (var i = 1; i <= n; ++i) {
      var line = lines[i];
      var lineSplit = line.trim().split(' ');

      var x = Number(lineSplit[0]);
      var y = Number(lineSplit[1]);

      var clause = makeClause(x, y);
      satQus.clauses[i-1] = clause;
    }

    assert(satQus.clauses.length === n, "not enough clause");

    return satQus;
  }
}

function checkIsSatisfiable(satQus) {
  // Using the strongly-connected component algorithm to check if a question is satisfiable
  // 1. Create implication graph from the 2sat problem
  // 2. Identify all SCC component from the graph
  // 3. Check if any graph contains a variable and its negation
  //    if so, then this 2Sat problem is un-satisfiable. return 0 as its satisfiability
  //    otherwise, it's satisfiable. return 1 as its satisfiability
  var ig = new ImplicationGraph(satQus);
  var sccList = ig.FindSCCs();
  var hasNegation = checkNegationInSccs(sccList);
  var result = hasNegation ? false : true;
  return result;
}

function Edge(start, finish) {
  this.start = start;
  this.finish = finish;
}

function ImplicationGraph(satQus) {
  this.n = satQus.size;

  // I don't need to find the solution,
  // I simply need to check for satisfiability,
  // so I don't need to store veriables.
  // V = { 1, 2, 3, ..., size }, the set of all vertices in graph
  // And their negations, -1, -2, -3, ... -size
  // So in total, there're 2 * this.n vertices in the ImplicationGraph.
  // E, the set of all edges, there are n clause => 2n edges at most
  // There might be duplicated edges, so I'd better track real edge size
  this.edgeCount = 0;

  // this.edges[i] is a {} of vertices, for example [j, k]
  this.edges = {};

  // check unique edges
  var addEdge = function(ig, edge) {
    var startPos = edge.start;
    var finishPos = edge.finish;

    if (!ig.edges[startPos]) {
      ig.edges[startPos] = {};
    };

    var dests = ig.edges[startPos];

    if (!(finishPos in dests))
      dests[finishPos] = '';

    ig.edgeCount++;
  }

  for (var i = 0; i < this.n; ++i) {
    var clause = satQus.clauses[i];

    // rule
    // x V y =>   -x -> y , and -y -> x
    var leftTerm = clause.signX ? clause.idX : -clause.idX;
    var rightTerm = clause.signY ? clause.idY : -clause.idY;

    var edge1 = new Edge(-leftTerm, rightTerm);
    var edge2 = new Edge(-rightTerm, leftTerm);

    addEdge(this, edge1);
    addEdge(this, edge2);
  }

  console.log('ImplicationGraph size ', this.n);
  console.log('ImplicationGraph edgeCount ', this.edgeCount);

  //console.log('ImplicationGraph.edges ', this.edges);
}

ImplicationGraph.prototype.FindSCCs = function() {
  // return a list of verticies, that are SCCs in the ImplicationGraph

  var self = this;

  var tj = {};
  tj.s = [];
  tj.sset = {};
  tj.scc = [];
  tj.props = {};
  tj.index = 0;

  for (var i = 1; i < self.n; ++i) {
    if (!tj.props[i]) {
      DoTarjan(tj, i);
    }
    if (!tj.props[-i]) {
      DoTarjan(tj, -i);
    }
  }

  return tj.scc;

  function DoTarjan(tj, v) {
    var vprop = new Prop(tj.index, tj.index);
    tj.props[v] = vprop;
    tj.index++;

    tj.s.push(v);
    tj.sset[v] = 0;

    // Get all edges come out of v
    for (var dest in self.edges[v]) {
      if (!tj.props[dest]) { // if dest has not been discovered
        DoTarjan(tj, dest);
        vprop.lowlink = Math.min(tj.props[dest].lowlink, vprop.lowlink);
      } else if (dest in tj.sset) {
        vprop.lowlink = Math.min(tj.props[dest].lowlink, vprop.lowlink);
      }
    } // end of checking all sub-verticies

    if (vprop.index === vprop.lowlink) {
      // Find a SCC

      var aScc = [];
      var top = 0;
      while (true) {
        top = tj.s.pop();
        delete tj.sset[top];
        aScc.push(top);

        if (top === v)
          break;
      }

      tj.scc.push(aScc);
    }
  } // end of DoTarjan
}

function checkNegationInSccs(sccList) {
  // Return true if negation is found, 0 otherwise
  var len = sccList.length;
  for (var i = 0; i < len; ++i) {
    var scc = sccList[i];
    var set = {};
    var sccLen = scc.length;
    for (var j = 0; j < sccLen; ++j) {
      var v = scc[j];
      if (-v in set)
        return true; // found negation

      set[v] = 0; // record itself
    }
  }

  return false
}

function Prop(index, lowlink) {
  this.index = index;
  this.lowlink = lowlink;
}

module.exports.assignment61 = assignment61;
module.exports.read2SatQuestionFromFile = read2SatQuestionFromFile;
module.exports.checkIsSatisfiable = checkIsSatisfiable;
module.exports.ImplicationGraph = ImplicationGraph;
module.exports.checkNegationInSccs = checkNegationInSccs;
