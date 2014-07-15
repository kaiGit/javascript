// for each async
// I create this js to replace the forEach library
function ForEachAsync(array, action)
{
  var index = 0;

  function functor() {
    if (array === null)
      return;

    if (index in array) {
      action(array[index], index, array);
      ++ index;
    }

    if (index >= array.length) {
      index = null;
      array = null;
    }
  };

  return functor;
}

function PrintOne(v, index, array) {
  console.log("print one", v, index, array);
}

var func = ForEachAsync(['a', 'b', 'c', 'd'], PrintOne);
func();
func();
func();
func();
func();
func();
func();
func();
