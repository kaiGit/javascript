// for each async
// I create this js to replace the forEach library
function foreachAsync(array, action)
{
  var index = 0;

  var functor = function () {
    if (array === null)
      return null;

    if (index in array) {
      var currentIndex = index;
      ++ index;

      action(array[currentIndex], index, array, functor);
    }
  };

  return functor();
}

function PrintOne(v, index, array, asyncNext) {
  console.log("PrintOne", v, index, array);
  setTimeout(asyncNext, 500);
}


foreachAsync(['a', 'b', 'c', 'd'], PrintOne);
