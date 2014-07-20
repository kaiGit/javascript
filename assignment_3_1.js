// knapsack problem

function Item(id, value, weight) {
  this.id = id;
  this.value = value;
  this.weight = weight;
};

function assignment31(input, shouldRecurse, cb) {
  console.log('input = ', input);

  var fs = require('fs');
  fs.readFile(input, 'utf8', getFileContentCB);

  // Due to async nature of javascript, all logic after reading a file is here
  function getFileContentCB(error, data) {
    if (error) throw error;


    var lines = data.split('\n');
    var lineCount = lines.length;
    var temp = lines[0].split(' ');
    var size = Number(temp[0]);
    var itemCount = Number(temp[1]);
    var itemList = new Array(itemCount);

    console.log('knapsack size = ', size);
    console.log('itemcount = ', itemCount);

    for (var i = 1; i <= itemCount; ++i) {
      var line = lines[i];
      var lineSplit = line.trim().split(' ');

      var value = Number(lineSplit[0]);
      var weight = Number(lineSplit[1]);

      itemList[i-1] = new Item(i, value, weight);
    }

    console.log("first item", itemList[0]);
    console.log("first item", itemList[itemCount - 1]);

    var result = null;
    if (shouldRecurse) {
      result = knapsackRecur(size, itemList);
    } else {
      result = knapsackIter(size, itemList);
    }

    if (cb) cb(result);
  }
}

function knapsackIter(bagSize, itemList) {
  var itemCount = itemList.length;

  var arrayUtil = require('./ArrayUtil.js');
  // for(var k in arrayUtil)
  //   console.log(k);

  var maxValue = arrayUtil.Create2DAllo(bagSize+1, itemCount+1);

  for (var i = 0; i < bagSize + 1; ++i) {
    maxValue[i][0] = 0;
  }

  for (var i = 0; i < itemCount + 1; ++i) {
    maxValue[0][i] = 0;
  }

  for (var itemIndex = 1; itemIndex <= itemCount; ++itemIndex) {
    for (var bagIndex = 1; bagIndex <= bagSize; ++bagIndex) {
      var localMaxValue = 0;
      var withValue = 0;
      var withoutValue = 0;
      var item = itemList[itemIndex-1];

      // without itemList[itemIndex];
      withoutValue = maxValue[bagIndex][itemIndex-1];

      try {
        if (bagIndex < item.weight) {
          // item too big, doesn't fit
          // the only value is without value
          localMaxValue = withoutValue;
        } else {
          // choose what ever is bigger
          withValue = item.value + maxValue[bagIndex - item.weight][itemIndex - 1];
          localMaxValue = (withValue > withoutValue) ? withValue : withoutValue;
        }

        maxValue[bagIndex][itemIndex] = localMaxValue;
      } catch (error) {
        console.log(item, error);
        throw error;
      }



    }
  } // End of double loop

  console.log("maxValue = ", maxValue[bagSize][itemCount]);

  return maxValue[bagSize][itemCount];
}

function knapsackRecur(bagSize, itemList) {
  var itemCount = itemList.length;
  var arrayUtil = require('./ArrayUtil.js');
  var maxValue = {}

  function set(bagIndex, itemIndex, value) {
    var key = bagIndex.toString() + '-' + itemIndex.toString();
    maxValue[key] = value;
  }

  function get(bagIndex, itemIndex) {
    var key = bagIndex.toString() + '-' + itemIndex.toString();
    if (key in maxValue)
      return maxValue[key];

    return null;
  }

  // var countRecur = 0;
  function knapsackRecurImpl(bagIndex, itemIndex) {
    // console.log(bagIndex, itemIndex);
    // ++countRecur;
    // if (countRecur > 10)
    //   return;

    if (bagIndex <= 0)
      return 0;

    if (itemIndex <= 0)
      return 0;


    var cacheValue = get(bagIndex, itemIndex);
    if (cacheValue !== null) {
      return cacheValue;
    }

    var item = null;
    var localMaxValue = null;

    try {
      item = itemList[itemIndex-1];

      var withoutValue = knapsackRecurImpl(bagIndex, itemIndex-1);

      if (bagIndex < item.weight) {
        // item too big, doesn't fit
        // the only value is without value
        localMaxValue = withoutValue;
      } else {
        // choose what ever is bigger
        withValue = item.value + knapsackRecurImpl(bagIndex - item.weight, itemIndex - 1);
        localMaxValue = (withValue > withoutValue) ? withValue : withoutValue;
      }

      set(bagIndex,itemIndex, localMaxValue);
      return localMaxValue;

    } catch (error) {
      console.log(itemIndex, item, error);
      throw error;
    }
  } // end of function knapsackRecurImpl

  knapsackRecurImpl(bagSize, itemCount);

  console.log("maxValue = ", get(bagSize, itemCount));



  return get(bagSize, itemCount);
}


exports.assignment31 = assignment31;
