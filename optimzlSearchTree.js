// This is to solve the optimal binary tree issue
// input, a list of nodes's frequency
var freq = [0.05, 0.4, 0.08, 0.04, 0.1, 0.1, 0.23];


function minAvgSearchTie(freq) {

  var len = freq.length;
  var avg = new Array(len);
  for (var i = 0; i < len; ++i) {
    avg[i] = new Array(len);
  }

  var readAvg = function(i, j) {
    if (0 <= i && i < len
      && 0 <= j && j < len)
      return avg[i][j];

    return 0;
  }

  for (var i = 0; i < len; ++i) {
    for (var j = 0; j < len; ++j) {
      if (i == j) {
        avg[i][j] = freq[i];
      } else {
        // console.log(typeof (avg[i]));
        // console.log(typeof (avg[i][j]));
        avg[i][j] = 0;
      }
    }
  }

  // console.log(avg);

  for (var step = 1; step <= len - 1; ++step) {
    for (var i = 0; i < len; ++i)
    {
      // calculate avg[i][i+step]
      var j = i + step;
      if (j >= len) {
        j = len - 1;
      }

      var base = 0;
      for (var k = i; k <= j; ++k) {
          base += freq[k];
      }

      // console.log('base', i, step, ' = ', base);

      var min = null;
      for (var r = i; r <= j; ++r) {
        var left = readAvg(i, r-1);
        var right = readAvg(r+1, j);

        // console.log('left', [i, r-1], ' = ', left);
        // console.log('right', [r+1, j], ' = ', right);

        if (!min || left + right < min) {
          min = left + right;
        }
      }

      // console.log('min', i, step, ' = ', min);

      avg[i][j] = base + min;
    }
  }

  return avg;
}

function Test(args) {
  console.log('Test', args);
  var avg = minAvgSearchTie(args);
  console.log(avg[0][args.length-1]);
  console.log();
}


Test(freq);
Test([1, 2, 3]);
Test([3, 2, 1]);
Test([1, 3, 2]);
