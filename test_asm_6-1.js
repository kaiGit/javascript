// test61.js
var a61 = require('./assignment-6-1.js');

//a61.assignment61('./testdata/2sat1.txt');

var q = a61.read2SatQuestionFromFile('./testdata/2sat_s_1.txt');
q.variables[1] = true;
console.log("at1.IsSatisfied()", q.IsSatisfied(), ' => true');
q.variables[2] = true;
console.log("at1.IsSatisfied()", q.IsSatisfied(), ' => true');
q.variables[1] = false;
console.log("at1.IsSatisfied()", q.IsSatisfied(), ' => false');
var ig = new a61.ImplicationGraph(q);
console.log("ImplicationGraph.edges", ig.edges);
var scc = ig.FindSCCs()
console.log("ImplicationGraph.FindSccs", scc);
var hasNegation = a61.checkNegationInSccs(scc);
console.log("ImplicationGraph.ExistsNegationin Scc ", hasNegation);

var q = a61.read2SatQuestionFromFile('./testdata/2sat_s_2_false.txt');
var ig = new a61.ImplicationGraph(q);
console.log("ImplicationGraph.edges", ig.edges);
var scc = ig.FindSCCs()
console.log("ImplicationGraph.FindSccs", scc);
var hasNegation = a61.checkNegationInSccs(scc);
console.log("ImplicationGraph.ExistsNegationin Scc ", hasNegation);

var q = a61.read2SatQuestionFromFile('./testdata/2sat_s_3.txt');
var ig = new a61.ImplicationGraph(q);
console.log("ImplicationGraph.edges", ig.edges);
var scc = ig.FindSCCs()
console.log("ImplicationGraph.FindSccs", scc);
var hasNegation = a61.checkNegationInSccs(scc);
console.log("ImplicationGraph.ExistsNegationin Scc ", hasNegation);

var q = a61.assignment61('./testdata/2sat_s_1.txt');
console.log('a61 result = ' + q);

var q = a61.assignment61('./testdata/2sat_s_2_false.txt');
console.log('a61 result = ' + q);

var q = a61.assignment61('./testdata/2sat_s_3.txt');
console.log('a61 result = ' + q);

console.log("real assignment");

function Test(input) {
  var q = a61.assignment61(input);
  console.log(input + ' result = '.red + q);
}


//
// The data size is too big, I have to use
// node --max-old-space-size=8192  test_asm_6-1.js
// otherwise, I'll get memory allocation erro
//
Test('./testdata/2sat1.txt');
Test('./testdata/2sat2.txt');
Test('./testdata/2sat3.txt');
Test('./testdata/2sat4.txt');
Test('./testdata/2sat5.txt');
Test('./testdata/2sat6.txt');
