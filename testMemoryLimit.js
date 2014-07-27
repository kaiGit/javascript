var myList = [];
var i = 0;
var batch = 1000000;
setInterval(function() {
  console.log("tick " + i.toString());
  ++i;

  var newBuffer = new Array(batch);
  for (var x = 0; x < batch; ++x) {
    newBuffer[x] = x;
  }
  myList.push(newBuffer);
}, 100);
