// wis

function wisRecur(input, startIndex)
{
  var len = input.length;
  var cachewis = new Array(len);

  for(var i = 0; i < len; ++i) {
    cachewis[i] = 0;
  }

  function wisRecurImpl(startIndex) {
    if (startIndex >= len)
      return 0;

    if (startIndex == len - 1) {
      var wis = input[len-1];
      cachewis[startIndex] = wis;
      return wis;
    }

    var wisA = wisRecurImpl(startIndex+1);
    var wisB = wisRecurImpl(startIndex+2);

    var wis = Math.max(wisA, input[startIndex] + wisB);
    cachewis[startIndex] = wis;

    return wis;
  }

  return wisRecurImpl(0);
}

function wisIter(input, startIndex)
{
  var len = input.length;
  var cachewis = new Array(len);

  for(var i = 0; i < len; ++i) {
    cachewis[i] = 0;
  }

  cachewis[0] = input[0];
  cachewis[1] = Math.max(input[0], input[1]);

  var index = 2;
  while (index < len) {
    var wisA = cachewis[index-1];
    var wisB = cachewis[index-2] + input[index];
    var wis = Math.max(wisA, wisB);
    cachewis[index] = wis;
    ++index;
  }

  return cachewis[len-1];
}

exports.wisRecur = wisRecur;
exports.wisIter = wisIter;

function TestWis(input) {
  var result = wisRecur(input);
  console.log('Recur', input, '=>', result);

  var result2 = wisIter(input);
  console.log('Iter ', input, '=>', result2);
}

TestWis([1, 2, 3, 4]);
TestWis([1, 4, 5, 4]);
TestWis([5, 4, 5, 4]);
