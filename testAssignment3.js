var a22 = require('./assignment_3_1.js');

function pa31(cb) {
  a22.assignment31('./testdata/knapsack1.txt', false, function(input){
    console.log(input, "expect", "unknown", '\n');
    console.log();
    if (cb) cb();
  });
}

function pa31_recur(cb) {
  a22.assignment31('./testdata/knapsack_big.txt', true, function(input){
    console.log(input, "expect", "unknown", '\n');
    console.log();
    if (cb) cb();
  });
}


function pa32(cb) {
  a22.assignment31('./testdata/knapsack1.txt', true, function(input){
    console.log(input, "expect", "unknown", '\n');
    console.log();
    if (cb) cb();
  });
}


function test1(cb) {
  a22.assignment31('./testdata/test3_1', false, function(input){
    console.log(input, "expect", 6, '\n');
    console.log();
    if (cb) cb();
  });
}


function test12(cb) {
  a22.assignment31('./testdata/test3_1', true, function(input){
    console.log(input, "expect", 6, '\n');
    console.log();
    if (cb) cb();
  });
}


function test4(cb) {
  a22.assignment31('./testdata/test3_4', false, function(input){
    console.log(input, "expect", 60, '\n');
    console.log();
    if (cb) cb();
  });
}


function test42(cb) {
  a22.assignment31('./testdata/test3_4', true, function(input){
    console.log(input, "expect", 60, '\n');
    console.log();
    if (cb) cb();
  });
}

function test5(cb) {
  a22.assignment31('./testdata/test3_5', false, function(input){
    console.log(input, "expect", 27000, '\n');
    console.log();
    if (cb) cb();
  });
}

function test52(cb) {
  a22.assignment31('./testdata/test3_5', true, function(input){
    console.log(input, "expect", 27000, '\n');
    console.log();
    if (cb) cb();
  });
}


pa31();

pa31_recur();

test12(
  function () {
    test42(
      function() {
        test52();
      }
    );
  }
);
